export const copyToClipboard = async (
  text: string,
  setCopySuccess: (value: boolean) => void
) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1000);
  } catch (error) {
    console.error('복사 실패!');
  }
};
