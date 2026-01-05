import Image, { StaticImageData } from "next/image";

type ActiveUsersProps = {
  statistics?: {
    activeUsers?: number | string;
  };
  photos: StaticImageData[]; // paths from public/assets
};

export function ActiveUsers({ statistics, photos }: ActiveUsersProps) {
  const activeUsers = statistics?.activeUsers ?? "+0";

  
  const max = 4;
  const visiblePhotos = photos.slice(0, max);
  const normalPhotos = visiblePhotos.slice(0, visiblePhotos.length - 1);
  const lastPhoto = visiblePhotos[visiblePhotos.length - 1];

  return (
    <div className="flex items-center gap-3 -mt-2">
      {/* Text */}
      <span className="flex items-center gap-2 text-gray-700">
        <span className="text-gray-500 font-normal text-24">
          {activeUsers}
        </span>
        <span className="text-gray-500 font-normal text-12">
          Active Users
        </span>
      </span>

      {/* Avatars */}
      <div className="flex -space-x-2">
        {normalPhotos.map((src, index) => (
          <div
            key={index}
            className="relative w-10 h-10 rounded-full border-1S border-white overflow-hidden bg-gray-100"
          >
            <Image
              src={src}
              alt={`user-${index}`}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        ))}

        {/* Last avatar with overlay */}
        {lastPhoto && (
          <div className="relative w-10 h-10 rounded-full border-1 border-white overflow-hidden bg-gray-100">
            <Image
              src={lastPhoto}
              alt="active-users"
              fill
              sizes="40px"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-xs font-normal text-white">
                {activeUsers}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
