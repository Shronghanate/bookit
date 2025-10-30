
import React from 'react';
import { StarIcon } from './Icons';

interface StarRatingProps {
    rating: number;
    reviewCount?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviewCount }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
            ))}
            {reviewCount && <span className="text-xs text-gray-500 ml-2">({reviewCount} reviews)</span>}
        </div>
    );
};

export default StarRating;
