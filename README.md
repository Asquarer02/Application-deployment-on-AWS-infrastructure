# Cloud-Native Web Application on AWS

This project demonstrates the deployment of a cloud-based web application following modern cloud-native architecture principles on AWS. The application consists of a separate backend service for CRUD operations and user authentication, and a frontend client that consumes the backend via REST APIs.

**Live Demo URLs:**
*   **Frontend:** `[YOUR_ELASTIC_BEANSTALK_APP_URL_HERE]` (e.g., http://my-cloud-app-frontend-env.us-east-1.elasticbeanstalk.com)
*   **Backend API Base URL:** `[YOUR_EC2_BACKEND_API_URL_HERE]` (e.g., http://YOUR_EC2_PUBLIC_IP:3001/api)

**GitHub Repository:**
*   `[YOUR_GITHUB_REPO_LINK_HERE]`

## Table of Contents
1.  [Project Overview](#project-overview)
2.  [Features](#features)
3.  [Tech Stack](#tech-stack)
4.  [Architecture](#architecture)
5.  [Prerequisites](#prerequisites)
6.  [Local Development Setup](#local-development-setup)
7.  [AWS Deployment Guide](#aws-deployment-guide)
    *   [AWS Infrastructure Setup](#aws-infrastructure-setup)
    *   [Backend Deployment (EC2 & Docker)](#backend-deployment-ec2--docker)
    *   [Frontend Deployment (Elastic Beanstalk)](#frontend-deployment-elastic-beanstalk)
8.  [Security Implementation](#security-implementation)
9.  [Troubleshooting & Notes](#troubleshooting--notes)

## Project Overview

The application allows users to register, log in, and perform CRUD (Create, Read, Update, Delete) operations on "Posts." Each post can include a title, content, and an optional image uploaded by the user. The backend and frontend are independently deployable components.

## Features

*   User Registration and Authentication (JWT-based)
*   CRUD operations for Posts (Create, Read, Update, Delete)
*   Image uploads associated with posts, stored in AWS S3
*   Separation of frontend and backend concerns
*   Deployed on a production-like, secure AWS architecture

## Tech Stack

**Frontend:**
*   React.js
*   Tailwind CSS (for styling)
*   Axios (for API calls)
*   React Router

**Backend:**
*   Node.js
*   Express.js
*   JWT (JSON Web Tokens) for authentication
*   bcryptjs (for password hashing)
*   AWS SDK v3 (for S3 and DynamoDB interaction)
*   Multer & Multer-S3 (for file uploads)
*   Docker

**Database:**
*   Amazon DynamoDB (NoSQL)

**File Storage:**
*   Amazon S3

**AWS Cloud Services Used:**
*   Amazon EC2 (Elastic Compute Cloud) - for backend hosting
*   Amazon ECR (Elastic Container Registry) - for Docker image storage
*   Amazon S3 (Simple Storage Service) - for image uploads
*   Amazon DynamoDB - for database
*   Amazon Elastic Beanstalk - for frontend hosting
*   AWS IAM (Identity and Access Management) - for secure access control
*   Amazon VPC (Virtual Private Cloud) - for network isolation
*   Amazon CloudWatch (for logs, implicitly)

## Architecture

*(This section would ideally refer to your PDF architecture diagram. You can also provide a brief textual description here).*

The system comprises a React frontend deployed on Elastic Beanstalk. This frontend communicates via REST APIs with a Node.js backend. The backend is containerized using Docker and deployed on an EC2 instance. User data and post metadata are stored in DynamoDB, while uploaded images are stored in an S3 bucket. All resources are provisioned within a custom VPC with appropriate security groups and IAM roles to ensure a secure, least-privilege access model.

*(See `architecture_diagram.pdf` in this repository for a visual representation).*

## Prerequisites

*   AWS Account (Free Tier eligible is sufficient for this project)
*   AWS CLI installed and configured locally (for ECR push and local testing against AWS services)
*   Node.js and npm (or Yarn) installed locally
*   Docker Desktop (or Docker Engine) installed and running locally
*   Git installed locally
*   A code editor (e.g., VS Code)
*   Postman or cURL (for testing backend APIs locally)

## Local Development Setup

**1. Clone the Repository:**
```bash
git clone https://github.com/Asquarer02/Application-deployment-on-AWS-infrastructure
cd Application-deployment-on-AWS-infrastructure