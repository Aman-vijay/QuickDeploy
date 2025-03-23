// src/controllers/authController.ts
import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in .env');
}

export const handleGitHubCallback = async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Get access token from GitHub
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: { 
          Accept: 'application/json',
          "Content-Type": "application/json"
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ error: 'Failed to obtain access token' });
    }

    // Get user data and emails in parallel
    const [userResponse, emailsResponse] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }),
      axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    ]);

    const userData = userResponse.data;
    const emails = emailsResponse.data;

    // Find the primary verified email
    const primaryEmailObj = emails.find(
      (email: any) => email.primary && email.verified
    );
    const userEmail = primaryEmailObj ? primaryEmailObj.email : null;

    // Create or update user
    let user = await User.findOne({ githubId: userData.id });
    if (!user) {
      user = new User({
        githubId: userData.id,
        username: userData.login,
        email: userEmail,
        avatarUrl: userData.avatar_url || null,
        githubToken: accessToken,
      });
    } else {
      user.githubToken = accessToken;
      // Update email if not set and we have a new value
      if (!user.email && userEmail) {
        user.email = userEmail;
      }
    }
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        githubId: user.githubId, 
        username: user.username,
        email: user.email
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Keep the rest of the controller methods the same
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGitHubRepos = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user || !user.githubToken) {
      return res.status(401).json({ error: 'Unauthorized or no GitHub token' });
    }

    const reposResponse = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${user.githubToken}` },
    });

    res.status(200).json({ repos: reposResponse.data });
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};