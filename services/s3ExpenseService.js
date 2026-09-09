const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = require("../config/s3");
const Expense = require("../models/expenseModel");

const ExpenseDownload = require("../models/expenseDownloadModel");

const downloadExpenses = async (userId) => {
  const expenses = await Expense.findAll({
    where: {
      user_id: userId,
    },
    order: [["createdAt", "DESC"]],
  });

  let csv = "ID,Amount,Description,Category,Note,Date\n";

  expenses.forEach((expense) => {
    csv += `"${expense.id}","${expense.amount}","${expense.description}","${expense.category}","${expense.note || ""}","${expense.createdAt}"\n`;
  });

  const fileKey = `expenses/user-${userId}/expenses-${Date.now()}.csv`;

  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey,
    Body: csv,
    ContentType: "text/csv",
  });

  await s3.send(uploadCommand);

  await ExpenseDownload.create({
    user_id: userId,
    fileKey,
  });

  const downloadCommand = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey,
    ResponseContentDisposition: `attachment; filename="my-expenses.csv"`,
  });

  const url = await getSignedUrl(s3, downloadCommand, {
    expiresIn: 3600,
  });

  return {
    url,
    fileKey,
  };
};

const getOldDownloadUrl = async (userId, fileKey) => {
  const download = await ExpenseDownload.findOne({
    where: {
      user_id: userId,
      fileKey,
    },
  });

  if (!download) {
    throw new Error("Download file not found");
  }

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey,
    ResponseContentDisposition: `attachment; filename="my-expenses.csv"`,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 3600,
  });

  return url;
};

module.exports = {
  downloadExpenses,
  getOldDownloadUrl,
};
