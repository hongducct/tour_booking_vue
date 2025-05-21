<template>
    <div class="good-night-container">
        <div class="stars"></div>
        <div class="twinkling"></div>
        <div class="clouds"></div>
        <div class="hearts">
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
            <div class="heart"></div>
        </div>
        <div class="message" @click="triggerEffects">
            <!-- <h1>Chúc em Tiên ngủ ngonnnn! 🌙</h1> -->
             <!-- <h1>Em Tiên nhớ ăn cơm đấy nhéeeee! 💕🤞😗</h1> -->
              <h1>Em Tiên xinh đẹpppp !!!</h1>
            <p>
                <!-- Lường Sa Ánh Tiên (Phan Anh), chúc em có một giấc ngủ thật ngon, mơ những giấc mơ đẹp và luôn hạnh phúc nhé! 💖 -->
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "GoodNightTien",
    methods: {
        triggerEffects() {
            // Add shake class to message
            const message = document.querySelector('.message');
            message.classList.add('shake');
            setTimeout(() => message.classList.remove('shake'), 500);

            // Create burst of hearts and stars
            this.createBurst(10, 'heart-burst');
            this.createBurst(10, 'star-burst');
        },
        createBurst(count, className) {
            const message = document.querySelector('.message');
            const container = document.querySelector('.good-night-container'); // Append to container for correct positioning
            const rect = message.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            for (let i = 0; i < count; i++) {
                const element = document.createElement('div');
                element.classList.add(className);
                container.appendChild(element);

                // Randomize position and animation properties
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100; // Reduced distance for visibility
                const size = 15 + Math.random() * 10;
                element.style.position = 'absolute';
                element.style.left = `${centerX - size / 2}px`; // Center element
                element.style.top = `${centerY - size / 2}px`;
                element.style.width = `${size}px`;
                element.style.height = `${size}px`;
                element.style.zIndex = '5'; // Ensure above other elements

                // Apply animation
                const duration = 1 + Math.random() * 0.5;
                element.style.animation = `burstAnimation ${duration}s ease-out forwards`;
                
                // Calculate end position relative to start
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;
                element.style.setProperty('--end-x', `${endX}px`);
                element.style.setProperty('--end-y', `${endY}px`);

                // Remove element after animation
                setTimeout(() => element.remove(), duration * 1000);
            }
        }
    }
};
</script>

<style scoped>
/* Enhanced Background animation */
.good-night-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(to bottom, #020024, #090979, #00d4ff);
    color: white;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.stars,
.twinkling,
.clouds,
.hearts {
    position: absolute;
    width: 100%;
    height: 100%;
}

.stars {
    background: transparent url('https://scontent.fhan5-10.fna.fbcdn.net/v/t1.15752-9/483700436_9379047868837626_7619933044561820295_n.png?_nc_cat=101&ccb=1-7&_nc_sid=0024fc&_nc_ohc=Gggj00UnoccQ7kNvwGjMXD_&_nc_oc=Adkqgjac3316gD7NWzqnw28Z-M2gY8sipa3nm8vOzFD48ASDu0w1jToDH00ZrigeHvk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fhan5-10.fna&oh=03_Q7cD2QHbOBqmaDOFHB_9cv2FPZv73nr9ZoGyt8wCVj_qtc1_Lg&oe=684D9B57') repeat top center;
    z-index: 0;
    animation: moveStars 80s linear infinite, twinkleStars 4s ease-in-out infinite;
    background-size: 20%;
}

.twinkling {
    background: transparent url('https://scontent.fhan5-10.fna.fbcdn.net/v/t1.15752-9/495071576_1444314373431775_6865525591187030553_n.png?_nc_cat=101&ccb=1-7&_nc_sid=0024fc&_nc_ohc=t02p6d--QycQ7kNvwH1wAiN&_nc_oc=AdmlHeexUrmsEGyA0tymXFAu5iJl6g8z4R_oCME6KXmbzsvx4PVl44svmmPhmlNgKF0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fhan5-10.fna&oh=03_Q7cD2QFW5VW-WLiPj7E5twuJTvHJdkmslZCTxxAQHVC8--wFIA&oe=684DAD02') repeat top center;
    z-index: 1;
    animation: moveTwinkling 120s linear infinite, pulseTwinkling 2.5s ease-in-out infinite;
    opacity: 0.85;
    background-size: 20%;
}

.clouds {
    background: transparent url('https://scontent.cdninstagram.com/v/t51.75761-15/497295054_18351465901197405_9087452036397340811_n.png?_nc_cat=102&ccb=7-5&_nc_sid=ecb677&_nc_ohc=hK6ZveTyYE8Q7kNvwH3CcUe&_nc_oc=AdntTZHooRQ-JfgbJ5Iw_Enz_zgmQPqaPCsKHjVwNrIhYzugxxpeoOVJs4X2dEmUT44&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=zpKeBtYeaK6cObxm6uiEQw&oh=00_AfI3KXYWFWwFmWMxJVs71rw4R6omYO58u5p1yjrbxQ5hZw&oe=68337B20') repeat top center;
    z-index: 2;
    animation: moveClouds 200s linear infinite, floatClouds 3.5s ease-in-out infinite alternate;
    background-size: 20%;
}

.hearts {
    z-index: 3;
    pointer-events: none;
    overflow: hidden;
}

.message {
    position: relative;
    z-index: 4;
    padding: 25px;
    margin: 20px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 20px;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    cursor: pointer;
    transition: transform 0.3s ease;
}

.message.shake {
    animation: shake 0.3s ease-in-out;
}

.message h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    animation: fadeIn 2.5s ease-in-out, pulseText 0.6s ease-in-out infinite alternate;
    color: #ffdb58;
    text-shadow: 3px 3px 10px rgba(255, 255, 255, 0.9);
}

.message p {
    font-size: 1.5rem;
    animation: fadeIn 4s ease-in-out;
    color: #ffffff;
    line-height: 1.7;
}

/* Heart Elements */
.heart {
    position: absolute;
    width: 25px;
    height: 25px;
    background: #ff4757;
    clip-path: polygon(50% 0%, 61% 19%, 81% 19%, 100% 38%, 100% 62%, 50% 100%, 0% 62%, 0% 38%, 19% 19%, 39% 19%);
    animation: floatHearts 6s linear infinite;
    opacity: 0;
    transform-origin: center;
}

/* Burst Elements */
.heart-burst {
    position: absolute;
    background: #ff4757;
    clip-path: polygon(50% 0%, 61% 19%, 81% 19%, 100% 38%, 100% 62%, 50% 100%, 0% 62%, 0% 38%, 19% 19%, 39% 19%);
    transform-origin: center;
}

.star-burst {
    position: absolute;
    background: #ffdb58;
    clip-path: polygon(50% 0%, 61% 20%, 100% 30%, 68% 50%, 79% 80%, 50% 65%, 21% 80%, 32% 50%, 0% 30%, 39% 20%);
    transform-origin: center;
}

/* Animations */
@keyframes moveStars {
    from { background-position: 0 0; }
    to { background-position: 4000px 0; }
}

@keyframes twinkleStars {
    0% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
    100% { opacity: 0.7; transform: scale(1); }
}

@keyframes moveTwinkling {
    from { background-position: 0 0; }
    to { background-position: -4000px 0; }
}

@keyframes pulseTwinkling {
    0% { opacity: 0.65; }
    50% { opacity: 1; }
    100% { opacity: 0.65; }
}

@keyframes moveClouds {
    from { background-position: 0 0; }
    to { background-position: 4000px 0; }
}

@keyframes floatClouds {
    0% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0); }
}

@keyframes floatHearts {
    0% {
        transform: translateY(100vh) scale(0.4) rotate(0deg);
        opacity: 0;
    }
    50% {
        transform: translateY(50vh) scale(0.8) rotate(180deg);
        opacity: 0.8;
    }
    100% {
        transform: translateY(-20vh) scale(1.2) rotate(360deg);
        opacity: 0;
    }
}

@keyframes burstAnimation {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(var(--end-x), var(--end-y)) scale(0.8);
        opacity: 0;
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes pulseText {
    from { transform: scale(1); }
    to { transform: scale(1.06); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-3px); }
}

/* Responsive Design */
@media (max-width: 768px) {
    .message h1 { font-size: 1.4rem; }
    .message p { font-size: 1rem; }
}

/* Predefined Hearts Positioning */
.heart:nth-child(1) { left: 10%; animation-delay: 0s; }
.heart:nth-child(2) { left: 30%; animation-delay: 1s; }
.heart:nth-child(3) { left: 50%; animation-delay: 2s; }
.heart:nth-child(4) { left: 70%; animation-delay: 0.5s; }
.heart:nth-child(5) { left: 90%; animation-delay: 1.5s; }
.heart:nth-child(6) { left: 15%; animation-delay: 2.5s; }
.heart:nth-child(7) { left: 25%; animation-delay: 3s; }
.heart:nth-child(8) { left: 40%; animation-delay: 0.8s; }
.heart:nth-child(9) { left: 60%; animation-delay: 1.2s; }
.heart:nth-child(10) { left: 80%; animation-delay: 2.8s; }
.heart:nth-child(11) { left: 5%; animation-delay: 1.8s; }
.heart:nth-child(12) { left: 35%; animation-delay: 2.2s; }
.heart:nth-child(13) { left: 55%; animation-delay: 0.3s; }
.heart:nth-child(14) { left: 75%; animation-delay: 1.7s; }
.heart:nth-child(15) { left: 95%; animation-delay: 2.4s; }
.heart:nth-child(16) { left: 20%; animation-delay: 0.6s; }
.heart:nth-child(17) { left: 45%; animation-delay: 1.4s; }
.heart:nth-child(18) { left: 65%; animation-delay: 2.1s; }
.heart:nth-child(19) { left: 85%; animation-delay: 0.9s; }
.heart:nth-child(20) { left: 12%; animation-delay: 1.9s; }
.heart:nth-child(21) { left: 32%; animation-delay: 2.6s; }
.heart:nth-child(22) { left: 52%; animation-delay: 0.4s; }
.heart:nth-child(23) { left: 72%; animation-delay: 1.1s; }
.heart:nth-child(24) { left: 92%; animation-delay: 2.3s; }
.heart:nth-child(25) { left: 8%; animation-delay: 1.0s; }
.heart:nth-child(26) { left: 28%; animation-delay: 2.7s; }
.heart:nth-child(27) { left: 48%; animation-delay: 0.2s; }
.heart:nth-child(28) { left: 68%; animation-delay: 1.3s; }
.heart:nth-child(29) { left: 88%; animation-delay: 2.0s; }
.heart:nth-child(30) { left: 18%; animation-delay: 0.7s; }
</style>