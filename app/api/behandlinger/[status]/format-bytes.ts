const k = 1000;
const sizes = ['bytes', 'kB', 'MB', 'GB', 'TB'];

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) {
    return '0 bytes';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`;
};
