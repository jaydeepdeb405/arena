import React from 'react';
import Swiper from "swiper"; 
import "swiper/css/swiper.css";
import './ArenaCredits.scss';

export default class ArenaCredits extends React.Component {

    componentDidMount() {
        var swiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 10,
            mousewheel: true,
            keyboard: {
                enabled: true
            },
            autoplay: {
                delay: 1500,
                disableOnInteraction: true
            },
            coverflowEffect: {
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    }

    render() {
        return (
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-nikesh.jpg)' }}><div className="label">Nikesh</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-mihir.jpg)' }}><div className="label">Mihir</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-vyas.jpg)' }}><div className="label">Vyas</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-jaydeepdeb.jpg)' }}><div className="label">Jaydeep</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-akshatha.jpg)' }}><div className="label">Akshatha</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-satheesh.jpg)' }}><div className="label">Satheesh</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-anirudh.jpg)' }}><div className="label">Anirudh</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-praveen.jpg)' }}><div className="label">Praveen</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-kesava.jpg)' }}><div className="label">Kesava</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-rajiv.jpg)' }}><div className="label">Rajiv</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-manoj.jpg)' }}><div className="label">Manoj</div></div>
                    <div className="swiper-slide" style={{ backgroundImage: 'url(https://dev71980.service-now.com/arena-credits-prashansa.jpg)' }}><div className="label">Prashansa</div></div>
                </div>
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
            </div>
        );
    }
}