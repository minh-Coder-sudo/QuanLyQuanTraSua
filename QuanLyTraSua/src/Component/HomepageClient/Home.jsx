import Hero from '../sections/home/hero/Hero';
import StorySection from '../sections/home/story/StorySection';
import ProductSection from '../sections/home/product/ProductSection';
import OriginSection from '../sections/home/origin/OriginSection';
import StoreFinder from '../sections/home/store/StoreFinder';
import InstagramNews from '../sections/home/social/InstagramNews';
import ProductSlider from '../sections/home/product/ProductSlider';
import FadeIn from '../../components/ui/FadeIn';
import Marquee from '../../components/ui/Marquee';
import StoryImages from '../sections/home/story/StoryImages';
export default function Home() {
    return (
        <>
            <Hero />
            <FadeIn>
                <Marquee />
            </FadeIn>

            <FadeIn>
                <StorySection />
            </FadeIn>

            <FadeIn>
                <ProductSlider />
            </FadeIn>

            <FadeIn>
                <OriginSection />
            </FadeIn>

            <FadeIn>
                <StoreFinder />
            </FadeIn>

            <FadeIn>
                <InstagramNews />
            </FadeIn>
        </>
    );
}
