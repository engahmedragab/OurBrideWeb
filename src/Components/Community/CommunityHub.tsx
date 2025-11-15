import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from '../../services/communityService';
import ContentCard from './Shared/ContentCard';
import SearchBar from './Shared/SearchBar';
import SEOHead from '../SEO/SEOHead';

export default function CommunityHub() {
    const [loading, setLoading] = useState(true);
    const [featuredContent, setFeaturedContent] = useState({
        articles: [],
        posts: [],
        reels: [],
        contests: [],
        polls: [],
    });

    useEffect(() => {
        loadFeaturedContent();
    }, []);

    const loadFeaturedContent = async () => {
        try {
            setLoading(true);
            const [articles, posts, reels, contests, polls] = await Promise.all([
                communityService.articles.getFeatured(1, 6).catch(() => ({ data: [] })),
                communityService.posts.getFeatured(1, 6).catch(() => ({ data: [] })),
                communityService.reels.getFeatured(1, 6).catch(() => ({ data: [] })),
                communityService.contests.getActive(1, 6).catch(() => ({ data: [] })),
                communityService.decisionGroups.getActive(1, 6).catch(() => ({ data: [] })),
            ]);

            // Handle both ApiResult format and direct data format
            const extractItems = (response) => {
                if (!response) return [];
                if (response.data && Array.isArray(response.data)) return response.data;
                if (Array.isArray(response)) return response;
                if (response.data && response.data.data && Array.isArray(response.data.data)) return response.data.data;
                return [];
            };

            setFeaturedContent({
                articles: extractItems(articles),
                posts: extractItems(posts),
                reels: extractItems(reels),
                contests: extractItems(contests),
                polls: extractItems(polls),
            });
        } catch (error) {
            console.error('Error loading featured content:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container my-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <SEOHead
                title="Community Hub"
                description="Discover articles, posts, reels, polls, and contests from our community"
                keywords="community, articles, posts, blogs, reels, polls, contests, wedding community"
                url={`${window.location.origin}/community`}
            />
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="display-4 mb-3">Community Hub</h1>
                    <p className="lead">Discover articles, posts, reels, polls, and contests from our community</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="row mb-5">
                <div className="col-12 col-md-8 mx-auto">
                    <SearchBar placeholder="Search articles, posts, blogs, reels, tags..." />
                </div>
            </div>

            {/* Quick Navigation */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="d-flex flex-wrap gap-3">
                        <Link to="/community/articles" className="btn btn-outline-primary">
                            <i className="fas fa-newspaper me-2"></i>Articles
                        </Link>
                        <Link to="/community/posts" className="btn btn-outline-primary">
                            <i className="fas fa-comments me-2"></i>Posts
                        </Link>
                        <Link to="/community/blogs" className="btn btn-outline-primary">
                            <i className="fas fa-blog me-2"></i>Blogs
                        </Link>
                        <Link to="/community/reels" className="btn btn-outline-primary">
                            <i className="fas fa-video me-2"></i>Reels
                        </Link>
                        <Link to="/community/decision-groups" className="btn btn-outline-primary">
                            <i className="fas fa-poll me-2"></i>Polls
                        </Link>
                        <Link to="/community/contests" className="btn btn-outline-primary">
                            <i className="fas fa-trophy me-2"></i>Contests
                        </Link>
                        <Link to="/community/tags" className="btn btn-outline-primary">
                            <i className="fas fa-tags me-2"></i>Tags
                        </Link>
                    </div>
                </div>
            </div>

            {/* Featured Articles */}
            {featuredContent.articles.length > 0 && (
                <div className="row mb-5">
                    <div className="col-12">
                        <h2 className="mb-3">
                            <Link to="/community/articles" className="text-decoration-none">
                                Featured Articles <i className="fas fa-arrow-right"></i>
                            </Link>
                        </h2>
                        <div className="row">
                            {featuredContent.articles.slice(0, 3).map((article) => (
                                <div key={article.id} className="col-md-4 mb-3">
                                    <ContentCard
                                        content={article}
                                        contentType="article"
                                        showActions={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Featured Posts */}
            {featuredContent.posts.length > 0 && (
                <div className="row mb-5">
                    <div className="col-12">
                        <h2 className="mb-3">
                            <Link to="/community/posts" className="text-decoration-none">
                                Featured Posts <i className="fas fa-arrow-right"></i>
                            </Link>
                        </h2>
                        <div className="row">
                            {featuredContent.posts.slice(0, 3).map((post) => (
                                <div key={post.id} className="col-md-4 mb-3">
                                    <ContentCard
                                        content={post}
                                        contentType="post"
                                        showActions={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Active Polls */}
            {featuredContent.polls.length > 0 && (
                <div className="row mb-5">
                    <div className="col-12">
                        <h2 className="mb-3">
                            <Link to="/community/decision-groups" className="text-decoration-none">
                                Active Polls <i className="fas fa-arrow-right"></i>
                            </Link>
                        </h2>
                        <div className="row">
                            {featuredContent.polls.slice(0, 3).map((poll) => (
                                <div key={poll.id} className="col-md-4 mb-3">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <Link to={`/community/decision-groups/${poll.id}`} className="text-decoration-none">
                                                    {poll.title}
                                                </Link>
                                            </h5>
                                            <p className="card-text">{poll.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Active Contests */}
            {featuredContent.contests.length > 0 && (
                <div className="row mb-5">
                    <div className="col-12">
                        <h2 className="mb-3">
                            <Link to="/community/contests" className="text-decoration-none">
                                Active Contests <i className="fas fa-arrow-right"></i>
                            </Link>
                        </h2>
                        <div className="row">
                            {featuredContent.contests.slice(0, 3).map((contest) => (
                                <div key={contest.id} className="col-md-4 mb-3">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <Link to={`/community/contests/${contest.id}`} className="text-decoration-none">
                                                    {contest.title}
                                                </Link>
                                            </h5>
                                            <p className="card-text">{contest.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

