import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import api from '../../services/api';

import './Banner.css';

function Banner() {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        async function loadBanners() {
            try {
                const response = await api.get('/banners');
                setBanners(response.data.banners || []);
            } catch (error) {
                showFlash(error.response?.data?.message || 'Não foi possível carregar os banners.', 'error');
            }
        }
        loadBanners();
    }, []);

    function bannerImage(banner) {
        return banner.image || banner.book_image
            ? 'http://localhost:5000/uploads/books/' + (banner.image || banner.book_image)
            : 'https://placehold.co/360x320?text=Sem+imagem';
    }

    if (banners.length === 0) {
        return null;
    }

    return (
        <section className="banner">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                loop={true}
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div className="banner-slide">
                            <div className="banner-content">
                                <h2>{banner.title || banner.book_title}</h2>
                                <p>
                                    {banner.description ||
                                        banner.subtitle ||
                                        banner.book_author ||
                                        'Confira os detalhes deste livro imperdível!'}
                                </p>
                                <Link
                                    to={banner.button_link || '/book/' + banner.reference_id}
                                    className="banner-btn"
                                >
                                    {banner.button_text || 'Ver Detalhes'}
                                </Link>
                            </div>
                            <div className="banner-image">
                                <img
                                    src={bannerImage(banner)}
                                    alt={banner.title || banner.book_title}
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}

export default Banner;
