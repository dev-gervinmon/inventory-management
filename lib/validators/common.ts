export function actionRequireId(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  if (!id) {
    throw new Error("ID is required");
  }
  return id;
}
