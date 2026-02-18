import CategoryCard from '@/src/components/categorycard/CategoryCard';
import CategoryCardLoader from '@/src/components/Loader/CategoryCard.loader';
import PageSlider from '@/src/components/pageslider/PageSlider';
import getSearch from '@/src/utils/getSearch.utils';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    generateSearchMeta,
    generatePaginationLinks,
    generateCanonicalUrl,
    generateItemListSchema
} from '@/src/utils/seo.utils';

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const [searchData, setSearchData] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearch = async () => {
            setLoading(true);
            try {
                const data = await getSearch(keyword, page);
                setSearchData(data.data);
                setTotalPages(data.totalPage);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching anime info:", err);
                setError(err);
                setLoading(false);
            }
        };
        fetchSearch();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [keyword, page]);

    const handlePageChange = (newPage) => {
        setSearchParams({ keyword, page: newPage });
    };

    const searchGridClass = "grid-cols-6 max-[1200px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:gap-x-2";

    const { title, description, keywords } = generateSearchMeta(keyword);
    const canonicalUrl = generateCanonicalUrl(`/search?keyword=${keyword || ''}${page > 1 ? `&page=${page}` : ''}`);
    const paginationLinks = generatePaginationLinks('/search', page, totalPages);

    // Create an ItemList for search results for SEO
    const itemListSchema = searchData && searchData.length > 0
        ? generateItemListSchema(searchData, `Search results for ${keyword}`)
        : null;

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <link rel="canonical" href={canonicalUrl} />

                {paginationLinks.map((link, index) => (
                    <link key={index} rel={link.rel} href={link.href} />
                ))}

                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />

                {itemListSchema && (
                    <script type="application/ld+json">
                        {JSON.stringify(itemListSchema)}
                    </script>
                )}
            </Helmet>
            <div className="max-w-[1600px] mx-auto flex flex-col mt-[64px] max-md:mt-[50px]">
                <div className="w-full flex flex-col gap-y-8 mt-6">
                    {loading ? (
                        <CategoryCardLoader className={"max-[478px]:mt-2"} gridClass={searchGridClass} />
                    ) : page > totalPages ? (
                        <div className="flex flex-col gap-y-4">
                            <h1 className="font-bold text-2xl text-white max-[478px]:text-[18px]">
                                Search Results
                            </h1>
                            <p className='text-white text-lg max-[478px]:text-[16px] max-[300px]:leading-6'>
                                You came a long way, go back <br className='max-[300px]:hidden' />nothing is here
                            </p>
                        </div>
                    ) : searchData && searchData.length > 0 ? (
                        <div className="flex flex-col gap-y-2 max-[478px]:gap-y-0">
                            <h1 className="font-bold text-2xl text-white max-[478px]:text-[18px]">
                                Search Results for: {keyword}
                            </h1>
                            <CategoryCard
                                data={searchData}
                                showViewMore={false}
                                className="mt-0"
                                gridClass={searchGridClass}
                            />
                            <div className="flex justify-center w-full mt-8">
                                <PageSlider
                                    page={page}
                                    totalPages={totalPages}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col gap-y-4">
                            <h1 className="font-bold text-2xl text-white max-[478px]:text-[18px]">
                                Search Results
                            </h1>
                            <p className='text-white text-lg max-[478px]:text-[16px]'>
                                Couldn't get search results, please try again
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-y-4">
                            <h1 className="font-bold text-2xl text-white max-[478px]:text-[18px]">
                                Search Results
                            </h1>
                            <p className='text-white text-lg max-[478px]:text-[16px]'>
                                No results found for: {keyword}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Search;
