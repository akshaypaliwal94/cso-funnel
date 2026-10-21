'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import Modal from '@/app/dfy-v2/components/common/Modal';

import { MainHeading } from '../common/Heading';

interface Video {
  thumbnail: string;
  vimeo: string;
  title: string;
}

// dfy-v2's own list: the shared `winnerVideos` in metaData feeds other funnels.
const winnerVideos: Video[] = [
  {
    thumbnail: '/assets/images/x-commune/winners/9.png',
    vimeo: 'https://player.vimeo.com/video/1233980992',
    title: 'Nikki',
  },
  {
    thumbnail: '/assets/images/x-commune/winners/1.png',
    vimeo: 'https://player.vimeo.com/video/1234034518',
    title: 'Hirav',
  },
  {
    thumbnail: '/assets/images/x-commune/winners/5.png',
    vimeo: 'https://player.vimeo.com/video/1234034517',
    title: 'Ayush',
  },
  {
    thumbnail: '/assets/images/x-commune/winners/7.png',
    vimeo: 'https://player.vimeo.com/video/1233980931',
    title: 'Stephen',
  },
  {
    thumbnail: '/assets/images/x-commune/winners/8.png',
    vimeo: 'https://player.vimeo.com/video/1233981723',
    title: 'Diego',
  },
];

interface VideoWithIndex extends Video {
  index: number;
}

const AUTO_SLIDE_INTERVAL = 6000;

const WinnerSlider: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [videosPerPage, setVideosPerPage] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateVideosPerPage = () => {
      setVideosPerPage(window.innerWidth < 640 ? 1 : 4);
    };

    updateVideosPerPage();
    window.addEventListener('resize', updateVideosPerPage);
    return () => window.removeEventListener('resize', updateVideosPerPage);
  }, []);

  const totalPages = Math.ceil(winnerVideos.length / videosPerPage);

  const openModal = useCallback((url: string, title: string) => {
    setIsPaused(true);
    setCurrentVideoUrl(url);
    setCurrentVideoTitle(title);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setCurrentVideoUrl('');
    setCurrentVideoTitle('');
    setIsModalOpen(false);
    setIsPaused(false);
  }, []);

  const handlePageChange = useCallback((pageIndex: number) => {
    setCurrentPage(pageIndex);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      return undefined;
    }

    timerRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [totalPages, isPaused]);
  const currentVideos: VideoWithIndex[] = Array.from({ length: videosPerPage })
    .map((_, i) => {
      const index = (currentPage * videosPerPage + i) % winnerVideos.length;
      const video = winnerVideos[index];
      return video ? { ...video, index } : null;
    })
    .filter((video): video is VideoWithIndex => video !== null);

  return (
    <section className="w-full px-4 py-8 text-center md:px-4 md:py-16">
      <MainHeading>Some more Wins...</MainHeading>

      <div className="relative mt-12 h-auto overflow-hidden">
        <div
          className={`grid gap-6 ${
            videosPerPage === 1
              ? 'grid-cols-1'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:py-4'
          }`}
        >
          {currentVideos.map(({ index, thumbnail, vimeo, title }) => (
            <div key={`${currentPage}-${index}`} className="w-full">
              <div
                role="button"
                tabIndex={0}
                aria-label={`Play ${title}`}
                className="cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-105"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => !isModalOpen && setIsPaused(false)}
                onClick={() => openModal(vimeo, title)}
                onKeyDown={handleKeyDown}
              >
                <img
                  src={thumbnail}
                  alt={`Thumbnail for ${title}`}
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="mt-8 flex justify-center space-x-3">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handlePageChange(index)}
            className={`size-3 rounded-full transition-colors ${
              currentPage === index
                ? 'bg-[#FF5C38]'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        modelWidth="w-[90%] md:w-[50%]"
        closeButtonClass="text-primary-1100"
      >
        <div className="w-full bg-black">
          <iframe
            width="100%"
            height="450"
            src={currentVideoUrl}
            title={currentVideoTitle}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal>
    </section>
  );
};

export default WinnerSlider;
