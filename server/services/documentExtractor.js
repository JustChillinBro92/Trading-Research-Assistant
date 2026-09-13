import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export async function extractDocument(file) {
  const extension = file.originalname.toLowerCase().split(".").pop();
  if (extension === "txt") return file.buffer.toString("utf8");
  if (extension === "docx")
    return (await mammoth.extractRawText({ buffer: file.buffer })).value;
  if (extension === "pdf") return (await pdfParse(file.buffer)).text;
  throw new Error("Unsupported file type. Upload a TXT, DOCX, or PDF file.");
}
