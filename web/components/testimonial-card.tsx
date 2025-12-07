'use client';

import { Star } from 'lucide-react';
import { getInitials, getAvatarColor } from '@/lib/utils/avatar-helpers';
import { Avatar } from '@/components/ui/avatar-initials';

export type CardLayout = 'base' | 'minimal' | 'detailed';
export type FontSize = 'small' | 'medium' | 'large';

interface TestimonialCardProps {
    testimonial: {
        id: string;
        title: string;
        content: string;
        stars_rating: number;
        media_type: 'text' | 'image' | 'video';
        media_url: string | null;
        created_at: string;
        author: {
            name: string;
            title?: string;
            avatar?: string;
        };
        category?: {
            name: string;
        };
        tags?: string[];
    };
    layout?: CardLayout;
    fontSize?: FontSize;
    theme?: 'light' | 'dark';
}

export function TestimonialCard({
    testimonial,
    layout = 'base',
    fontSize = 'medium',
    theme = 'light'
}: TestimonialCardProps) {
    const isDark = theme === 'dark';

    // Font size classes
    const fontSizeClasses = {
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base'
    };

    const titleSizeClasses = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg'
    };

    // Render stars with dynamic primary color
    const renderStars = () => {
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.stars_rating
                            ? ''
                            : isDark
                                ? 'text-gray-600'
                                : 'text-gray-300'
                            }`}
                        style={i < testimonial.stars_rating ? {
                            fill: 'var(--primary-color, #fbbf24)',
                            color: 'var(--primary-color, #fbbf24)'
                        } : undefined}
                    />
                ))}
            </div>
        );
    };

    // Render media
    const renderMedia = () => {
        if (testimonial.media_type === 'image' && testimonial.media_url) {
            return (
                <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                    <img
                        src={testimonial.media_url}
                        alt={testimonial.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            );
        }

        if (testimonial.media_type === 'video' && testimonial.media_url) {
            return (
                <div className="w-full aspect-video rounded-lg overflow-hidden mb-4">
                    <iframe
                        src={`https://www.youtube.com/embed/${testimonial.media_url}`}
                        title={testimonial.title}
                        style={{ border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
            );
        }

        return null;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Base card styles
    const cardBaseClasses = `
    rounded-xl p-6 transition-all duration-300 hover:shadow-xl
    ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
    border ${isDark ? 'border-gray-700' : 'border-gray-200'}
  `;

    // Minimal layout
    if (layout === 'minimal') {
        return (
            <div className={cardBaseClasses}>
                {renderMedia()}
                <div className="mb-3">{renderStars()}</div>
                <p className={`${fontSizeClasses[fontSize]} ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                    "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                    <Avatar
                        name={testimonial.author.name}
                        avatar={testimonial.author.avatar}
                        size="md"
                    />
                    <div>
                        <p className={`font-semibold ${titleSizeClasses[fontSize]}`}>
                            {testimonial.author.name}
                        </p>
                        {testimonial.author.title && (
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {testimonial.author.title}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Detailed layout
    if (layout === 'detailed') {
        return (
            <div className={cardBaseClasses}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar
                            name={testimonial.author.name}
                            avatar={testimonial.author.avatar}
                            size="lg"
                        />
                        <div>
                            <p className={`font-semibold ${titleSizeClasses[fontSize]}`}>
                                {testimonial.author.name}
                            </p>
                            {testimonial.author.title && (
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {testimonial.author.title}
                                </p>
                            )}
                        </div>
                    </div>
                    {renderStars()}
                </div>

                <h3 className={`font-bold ${titleSizeClasses[fontSize]} mb-2`}>
                    {testimonial.title}
                </h3>

                {renderMedia()}

                <p className={`${fontSizeClasses[fontSize]} ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                    {testimonial.content}
                </p>

                <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex gap-2 flex-wrap">
                        {testimonial.category && (
                            <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                                }`}>
                                {testimonial.category.name}
                            </span>
                        )}
                        {testimonial.tags?.slice(0, 2).map((tag, i) => (
                            <span
                                key={i}
                                className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(testimonial.created_at)}
                    </span>
                </div>
            </div>
        );
    }

    // Base layout (default)
    return (
        <div className={cardBaseClasses}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold ${titleSizeClasses[fontSize]}`}>
                    {testimonial.title}
                </h3>
                {renderStars()}
            </div>

            {renderMedia()}

            <p className={`${fontSizeClasses[fontSize]} ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                {testimonial.content}
            </p>

            <div className={`flex items-center gap-3 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <Avatar
                    name={testimonial.author.name}
                    avatar={testimonial.author.avatar}
                    size="md"
                />
                <div className="flex-1">
                    <p className={`font-semibold ${fontSizeClasses[fontSize]}`}>
                        {testimonial.author.name}
                    </p>
                    {testimonial.author.title && (
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {testimonial.author.title}
                        </p>
                    )}
                </div>
                {testimonial.category && (
                    <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {testimonial.category.name}
                    </span>
                )}
            </div>
        </div>
    );
}
