/**
 * 客户端S3文件上传辅助函数
 * 通过后端API上传文件到S3
 */

export async function storagePut(
  fileKey: string,
  data: Uint8Array | ArrayBuffer,
  contentType: string
): Promise<{ url: string; key: string }> {
  // 将数据转换为Base64
  const buffer = data instanceof Uint8Array ? data : new Uint8Array(data);
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(buffer)));

  // 调用后端API上传
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileKey,
      data: base64,
      contentType,
    }),
  });

  if (!response.ok) {
    throw new Error("上传失败");
  }

  const result = await response.json();
  return {
    url: result.url,
    key: fileKey,
  };
}
