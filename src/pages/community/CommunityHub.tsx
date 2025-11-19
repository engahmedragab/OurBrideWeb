import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import communityService from '@/services/communityService';
import ContentCard from '@/Components/Community/Shared/ContentCard';
import SearchBar from '@/Components/Community/Shared/SearchBar';
import SEOHead from '@/Components/SEO/SEOHead';
import HeroSection from '@/Components/Shared/HeroSection';
import SectionHeader from '@/Components/Shared/SectionHeader';
import CTASection from '@/Components/Shared/CTASection';
import LoadingScreen from '@/Components/LoadingScreen/LoadingScreen';

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
        return <LoadingScreen />;
    }

    const totalContent = 
        featuredContent.articles.length +
        featuredContent.posts.length +
        featuredContent.reels.length +
        featuredContent.contests.length +
        featuredContent.polls.length;

    return (
        <>
            <SEOHead
                title="Community Hub"
                description="Discover articles, posts, reels, polls, and contests from our community"
                keywords="community, articles, posts, blogs, reels, polls, contests, wedding community"
                image=""
                url={`${window.location.origin}/community`}
            />
            <div className="community-hub-section">
                {/* Hero Section */}
                <HeroSection
                    badge={{
                        icon: "fas fa-comments",
                        text: "Community Hub"
                    }}
                    title={
                        <>
                            Join Our <span className="text-gradient">Wedding Community</span>
                        </>
                    }
                    description="Discover articles, posts, reels, polls, and contests from our vibrant community. Share your wedding journey and connect with others."
                    stats={[
                        { number: totalContent > 0 ? `${totalContent}+` : "1000+", label: "Content Items" },
                        { number: "500+", label: "Active Members" },
                        { number: "4.9★", label: "Community Rating" },
                    ]}
                />

                {/* Search Bar Section */}
                <section className="search-section" style={{ padding: "40px 0", background: "white" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-8 mx-auto">
                                <SearchBar placeholder="Search articles, posts, blogs, reels, tags..." />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Navigation */}
                <section className="navigation-section" style={{ padding: "40px 0", background: "#f8f9fa" }}>
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <SectionHeader
                                    title="Explore Content Types"
                                    description="Browse different types of content shared by our community"
                                />
                            </div>
                        </div>
                        <div className="row justify-content-center mt-4">
                            <div className="col-12">
                                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    <Link to="/community/articles" className="btn btn-outline-main btn-lg">
                                        <i className="fas fa-newspaper me-2"></i>Articles
                                    </Link>
                                    <Link to="/community/posts" className="btn btn-outline-main btn-lg">
                                        <i className="fas fa-comments me-2"></i>Posts
                                    </Link>
                                    <Link to="/community/blogs" className="btn btn-outline-main btn-lg">
                                        <i className="fas fa-blog me-2"></i>Blogs
                                    </Link>
                                    <Link to="/community/reels" className="btn btn-outline-main btn-lg">
                                        <i className="fas fa-video me-2"></i>Reels
                                    </Link>
                                    <Link to="/community/decision-groups" className="btn btn-outline-main btn-lg">
                                        <i className="fas fa-poll me-2"></i>Polls
                                    </Link>
                                    <Link to="/community/contests" className="btn btn-outline-main btn-lg">
                                        <i className="fas fa-trophy me-2"></i>Contests
                                    </Link>
                                    <Link to="/community/tags" className="btn btn-outline-main btn-lg">
                                        <i className="fas fa-tags me-2"></i>Tags
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Content Sections */}
                {featuredContent.articles.length > 0 && (
                    <section className="featured-section" style={{ padding: "60px 0", background: "white" }}>
                        <div className="container">
                            <div className="row justify-content-center text-center mb-5">
                                <div className="col-lg-8">
                                    <SectionHeader
                                        badge={{ icon: "fas fa-newspaper", text: "Featured" }}
                                        title="Latest Articles"
                                        description="Discover insightful articles from our community"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                {featuredContent.articles.slice(0, 3).map((article) => (
                                    <div key={article.id} className="col-md-4 mb-4">
                                        <ContentCard
                                            content={article}
                                            contentType="article"
                                            showActions={false}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="row justify-content-center mt-4">
                                <div className="col-auto">
                                    <Link to="/community/articles" className="btn btn-outline-main">
                                        View All Articles <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {featuredContent.posts.length > 0 && (
                    <section className="featured-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                        <div className="container">
                            <div className="row justify-content-center text-center mb-5">
                                <div className="col-lg-8">
                                    <SectionHeader
                                        badge={{ icon: "fas fa-comments", text: "Trending" }}
                                        title="Community Posts"
                                        description="See what our community is sharing"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                {featuredContent.posts.slice(0, 3).map((post) => (
                                    <div key={post.id} className="col-md-4 mb-4">
                                        <ContentCard
                                            content={post}
                                            contentType="post"
                                            showActions={false}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="row justify-content-center mt-4">
                                <div className="col-auto">
                                    <Link to="/community/posts" className="btn btn-outline-main">
                                        View All Posts <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {featuredContent.polls.length > 0 && (
                    <section className="featured-section" style={{ padding: "60px 0", background: "white" }}>
                        <div className="container">
                            <div className="row justify-content-center text-center mb-5">
                                <div className="col-lg-8">
                                    <SectionHeader
                                        badge={{ icon: "fas fa-poll", text: "Active" }}
                                        title="Decision Groups"
                                        description="Participate in community polls and share your opinion"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                {featuredContent.polls.slice(0, 3).map((poll) => (
                                    <div key={poll.id} className="col-md-4 mb-4">
                                        <div className="card h-100 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden", transition: "all 0.3s ease" }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                            }}>
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
                            <div className="row justify-content-center mt-4">
                                <div className="col-auto">
                                    <Link to="/community/decision-groups" className="btn btn-outline-main">
                                        View All Polls <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {featuredContent.contests.length > 0 && (
                    <section className="featured-section" style={{ padding: "60px 0", background: "#f8f9fa" }}>
                        <div className="container">
                            <div className="row justify-content-center text-center mb-5">
                                <div className="col-lg-8">
                                    <SectionHeader
                                        badge={{ icon: "fas fa-trophy", text: "Competitions" }}
                                        title="Active Contests"
                                        description="Join exciting contests and win amazing prizes"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                {featuredContent.contests.slice(0, 3).map((contest) => (
                                    <div key={contest.id} className="col-md-4 mb-4">
                                        <div className="card h-100 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden", transition: "all 0.3s ease" }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
                                            }}>
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
                            <div className="row justify-content-center mt-4">
                                <div className="col-auto">
                                    <Link to="/community/contests" className="btn btn-outline-main">
                                        View All Contests <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <CTASection
                    title="Ready to Join Our Community?"
                    description="Share your wedding journey, connect with others, and discover amazing content from our vibrant community."
                    buttons={[
                        {
                            label: "Browse Articles",
                            icon: "fas fa-newspaper",
                            to: "/community/articles",
                            variant: "primary"
                        },
                        {
                            label: "View Posts",
                            icon: "fas fa-comments",
                            to: "/community/posts",
                            variant: "outline"
                        }
                    ]}
                />
            </div>
        </>
    );
}

