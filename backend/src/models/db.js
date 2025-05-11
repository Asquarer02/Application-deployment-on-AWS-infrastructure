// src/models/db.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  // Credentials will be automatically sourced from IAM role on EC2
  // or from environment variables/shared credentials file locally if configured.
});

const docClient = DynamoDBDocumentClient.from(client);

export default docClient;
