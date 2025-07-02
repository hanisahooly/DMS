export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileType: string): string => {
  const type = fileType.toLowerCase();
  
  const iconMap: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📽️',
    pptx: '📽️',
    txt: '📄',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    svg: '🖼️',
    mp4: '🎥',
    avi: '🎥',
    mov: '🎥',
    mp3: '🎵',
    wav: '🎵',
    zip: '🗜️',
    rar: '🗜️',
    '7z': '🗜️',
    dwg: '📐',
    dxf: '📐',
    rvt: '🏗️',
    ifc: '🏗️',
    skp: '🏗️',
  };
  
  return iconMap[type] || '📄';
};

export const getFileTypeColor = (fileType: string): string => {
  const type = fileType.toLowerCase();
  
  const colorMap: Record<string, string> = {
    pdf: 'bg-red-100 text-red-800',
    doc: 'bg-blue-100 text-blue-800',
    docx: 'bg-blue-100 text-blue-800',
    xls: 'bg-green-100 text-green-800',
    xlsx: 'bg-green-100 text-green-800',
    ppt: 'bg-orange-100 text-orange-800',
    pptx: 'bg-orange-100 text-orange-800',
    jpg: 'bg-purple-100 text-purple-800',
    jpeg: 'bg-purple-100 text-purple-800',
    png: 'bg-purple-100 text-purple-800',
    gif: 'bg-purple-100 text-purple-800',
    dwg: 'bg-indigo-100 text-indigo-800',
    dxf: 'bg-indigo-100 text-indigo-800',
    rvt: 'bg-yellow-100 text-yellow-800',
  };
  
  return colorMap[type] || 'bg-gray-100 text-gray-800';
};

export const isImageFile = (fileType: string): boolean => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];
  return imageTypes.includes(fileType.toLowerCase());
};

export const isCADFile = (fileType: string): boolean => {
  const cadTypes = ['dwg', 'dxf', 'rvt', 'ifc', 'skp', '3dm', 'step', 'iges'];
  return cadTypes.includes(fileType.toLowerCase());
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  return fileExtension ? allowedTypes.includes(fileExtension) : false;
};

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};