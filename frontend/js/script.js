document.getElementById("backToTop").addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth" // cuộn mượt
  });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle")
const nav = document.querySelector(".nav")

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active")

  // Animate hamburger menu
  const spans = menuToggle.querySelectorAll("span")
  if (nav.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translateY(10px)"
    spans[1].style.opacity = "0"
    spans[2].style.transform = "rotate(-45deg) translateY(-10px)"
  } else {
    spans[0].style.transform = "none"
    spans[1].style.opacity = "1"
    spans[2].style.transform = "none"
  }
})

// Sticky Header Effect
let lastScroll = 0
const header = document.querySelector(".header")

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  if (currentScroll > 100) {
    header.style.padding = "10px 0"
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)"
  } else {
    header.style.padding = "20px 0"
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)"
  }

  lastScroll = currentScroll
})

// Enhanced Filter Tabs Functionality
const filterTabs = document.querySelectorAll(".filter-tab")
const bowlCards = document.querySelectorAll(".bowl-card")

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Add click animation
    tab.style.transform = "scale(0.95)"
    setTimeout(() => {
      tab.style.transform = ""
    }, 150)

    // Remove active class from all tabs
    filterTabs.forEach((t) => t.classList.remove("active"))

    // Add active class to clicked tab
    tab.classList.add("active")

    // Get filter value
    const filterValue = tab.getAttribute("data-filter")

    // Filter bowl cards with enhanced animation
    bowlCards.forEach((card, index) => {
      if (filterValue === "all") {
        card.style.display = "block"
        setTimeout(() => {
          card.style.opacity = "1"
          card.style.transform = "translateY(0) scale(1)"
          card.classList.add("animate-bounce-in")
        }, index * 100)
      } else {
        const category = card.getAttribute("data-category")
        if (category === filterValue) {
          card.style.display = "block"
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "translateY(0) scale(1)"
            card.classList.add("animate-bounce-in")
          }, index * 100)
        } else {
          card.style.opacity = "0"
          card.style.transform = "translateY(20px) scale(0.8)"
          card.classList.remove("animate-bounce-in")
          setTimeout(() => {
            card.style.display = "none"
          }, 300)
        }
      }
    })
  })
})

// Step Cards Hover Effect
const stepCards = document.querySelectorAll(".step-card")

stepCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const stepNumber = card.getAttribute("data-step")
    card.style.backgroundColor = getStepColor(stepNumber)
    card.querySelector(".step-title").style.color = "#fff"
    card.querySelector(".step-content h4").style.color = "#fff"
    card.querySelector(".step-content p").style.color = "rgba(255, 255, 255, 0.9)"
    card.querySelector(".step-link").style.color = "#fff"
  })

  card.addEventListener("mouseleave", () => {
    card.style.backgroundColor = "#fff"
    card.querySelector(".step-title").style.color = "#1A1A1A"
    card.querySelector(".step-content h4").style.color = "#1A1A1A"
    card.querySelector(".step-content p").style.color = "#666666"
    card.querySelector(".step-link").style.color = "#4CAF50"
  })
})

function getStepColor(step) {
  const colors = {
    1: "#FF6B6B",
    2: "#4ECDC4",
    3: "#95E1D3",
    4: "#F38181",
  }
  return colors[step] || "#4CAF50"
}

// Smooth Scroll for Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Enhanced Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        entry.target.classList.add("animate-slide-up")
      }, index * 100)
    }
  })
}, observerOptions)

// Observe all sections with staggered animation
document.querySelectorAll("section").forEach((section, index) => {
  section.style.opacity = "0"
  section.style.transform = "translateY(50px)"
  section.style.transition = "opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  observer.observe(section)
})

// Reveal animations for directional elements
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view')
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.2 })

document.querySelectorAll('.animate-slide-left, .animate-slide-right').forEach((el) => {
  revealObserver.observe(el)
})

// Enhanced Bowl Card Animation on Scroll
const bowlObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0) scale(1)"
        entry.target.classList.add("animate-bounce-in")
      }, index * 150)
    }
  })
}, observerOptions)

bowlCards.forEach((card) => {
  card.style.opacity = "0"
  card.style.transform = "translateY(50px) scale(0.9)"
  card.style.transition = "opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  bowlObserver.observe(card)
})

// Enhanced Download Recipe Button
document.querySelectorAll(".download-recipe").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation()
    const bowlCard = button.closest(".bowl-card")
    const bowlName = bowlCard.querySelector(".bowl-name").textContent
    const bowlDescription = bowlCard.querySelector(".bowl-description").textContent
    const calories = bowlCard.querySelector(".calories-badge").textContent
    
    const recipeInfo = `📋 **${bowlName} Recipe**\n\n` +
      `🥗 **Ingredients:**\n${bowlDescription}\n\n` +
      `📊 **Nutrition:**\n${calories}\n\n` +
      `👨‍🍳 **Instructions:**\n` +
      `1. Prepare all ingredients fresh\n` +
      `2. Cook protein using sous-vide technique\n` +
      `3. Steam vegetables until tender\n` +
      `4. Cook rice/carbs according to package\n` +
      `5. Assemble bowl with love\n` +
      `6. Add sauce and enjoy!\n\n` +
      `💡 **Pro tip:** For best results, follow our exact cooking times!`
    
    alert(recipeInfo)
  })
})

// Step Link Functions
document.querySelectorAll(".step-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const stepCard = link.closest(".step-card")
    const stepTitle = stepCard.querySelector(".step-title").textContent
    
    showStepDetails(stepTitle)
  })
})

// Step Details Function
function showStepDetails(stepType) {
  let stepInfo = ""
  
  switch(stepType) {
    case "Protein":
      stepInfo = `🥩 **Protein Selection:**\n\n` +
        `🍖 **Available Proteins:**\n` +
        `• Beef Steak (Half/Full)\n` +
        `• Grilled Chicken\n` +
        `• Salmon\n` +
        `• Tuna\n` +
        `• Duck Breast\n` +
        `• Prawns\n` +
        `• Basa Fish\n\n` +
        `🔥 **Cooking Method:**\n` +
        `Sous-vide technique for maximum tenderness and flavor retention\n\n` +
        `💪 **Protein Benefits:**\n` +
        `• High-quality protein\n` +
        `• Essential amino acids\n` +
        `• Iron and B vitamins`
      break
      
    case "Carbs":
      stepInfo = `🌾 **Carb Selection:**\n\n` +
        `🍚 **Available Carbs:**\n` +
        `• Donburi Brown Rice\n` +
        `• Donburi White Rice\n` +
        `• Japanese Cold Soba\n` +
        `• Pasta\n` +
        `• Quinoa\n` +
        `• Baby Potato\n\n` +
        `⚡ **Energy Benefits:**\n` +
        `• Sustained energy release\n` +
        `• Complex carbohydrates\n` +
        `• Fiber for digestion\n\n` +
        `🎯 **Perfect for:**\n` +
        `• Pre/post workout\n` +
        `• Daily energy needs\n` +
        `• Balanced nutrition`
      break
      
    case "Side":
      stepInfo = `🥬 **Vegetable Selection:**\n\n` +
        `🥕 **Fresh Vegetables:**\n` +
        `• Broccoli\n` +
        `• Spinach\n` +
        `• Beetroot\n` +
        `• French Beans\n` +
        `• Mushrooms\n` +
        `• Pak Choi\n` +
        `• Cauliflower\n` +
        `• Cabbage\n` +
        `• Mixed Greens\n\n` +
        `🌱 **Health Benefits:**\n` +
        `• Vitamins & minerals\n` +
        `• Antioxidants\n` +
        `• Fiber\n` +
        `• Low calories\n\n` +
        `✨ **Fresh Daily:**\n` +
        `Hand-picked and prepared fresh every day`
      break
      
    case "Sauce":
      stepInfo = `🥄 **Sauce Selection:**\n\n` +
        `🌶️ **Available Sauces:**\n` +
        `• Teriyaki\n` +
        `• Cilantro Lime\n` +
        `• Spicy Mayo\n` +
        `• Sesame Ginger\n` +
        `• Sweet Chili\n` +
        `• Pesto\n\n` +
        `🎨 **Flavor Profiles:**\n` +
        `• Sweet & savory\n` +
        `• Spicy & tangy\n` +
        `• Fresh & herby\n\n` +
        `💡 **Pro Tip:**\n` +
        `Try different sauces to discover your perfect flavor combination!`
      break
  }
  
  alert(stepInfo)
}

// Calculate Calories Button
function calculateCalories() {
  const calculatorInfo = `🧮 **Build Your Bowl Calculator:**\n\n` +
    `📊 **Step-by-step process:**\n` +
    `1. Select your protein (20-60g)\n` +
    `2. Choose your carbs (30-60g)\n` +
    `3. Pick your vegetables (5-15g)\n` +
    `4. Add your sauce (5-20g)\n\n` +
    `🎯 **Get instant results:**\n` +
    `• Total calories\n` +
    `• Protein breakdown\n` +
    `• Carb content\n` +
    `• Fat percentage\n\n` +
    `💡 **Perfect for:**\n` +
    `• Weight management\n` +
    `• Fitness goals\n` +
    `• Dietary tracking\n\n` +
    `🌐 **Try our online calculator:**\n` +
    `soumaki.com.vn/calculator`
  
  alert(calculatorInfo)
}

// Experience Card Parallax Effect
document.querySelectorAll(".experience-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`
  })

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)"
  })
})

// Lazy Loading Images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src || img.src
        img.classList.remove("loading")
        imageObserver.unobserve(img)
      }
    })
  })

  document.querySelectorAll("img").forEach((img) => {
    img.classList.add("loading")
    imageObserver.observe(img)
  })
}

// Navigation Functions
function navigateToPage(page) {
  console.log(`Navigating to: ${page}`)
  
  switch(page) {
    case 'about':
      window.location.href = 'about-us.html'
      break
    case 'bowls':
      scrollToSection('.soumade-bowls-section')
      break
    case 'stores':
      showStoreLocations()
      break
    case 'delivery':
      showDeliveryOptions()
      break
    case 'contact':
      scrollToSection('.footer')
      break
    case 'calculator':
      openCaloriesCalculator()
      break
    case 'catering':
      showCateringInfo()
      break
    default:
      console.log(`Page ${page} not found`)
  }
}

// Hero Section Functions
function findStore() {
  showStoreLocations()
}

function orderNow() {
  showDeliveryOptions()
}

function learnMoreCatering() {
  showCateringInfo()
}

// Store Locations Function
function showStoreLocations() {
  const stores = [
    {
      name: "Soumaki District 1",
      address: "42 Ly Tu Trong, District 1, HCMC",
      phone: "0326238700",
      hours: "10AM - 9PM Daily"
    },
    {
      name: "Soumaki District 7",
      address: "S27-1, Sky Garden 1, District 7, HCMC",
      phone: "0326238700",
      hours: "10AM - 9PM Daily"
    },
    {
      name: "Soumaki District 2",
      address: "250 Nguyen Van Huong, District 2, HCMC",
      phone: "0326238700",
      hours: "10AM - 9PM Daily"
    }
  ]
  
  let storeInfo = "📍 **Soumaki Store Locations:**\n\n"
  stores.forEach((store, index) => {
    storeInfo += `${index + 1}. **${store.name}**\n`
    storeInfo += `   📍 ${store.address}\n`
    storeInfo += `   📞 ${store.phone}\n`
    storeInfo += `   🕒 ${store.hours}\n\n`
  })
  
  alert(storeInfo)
}

// Delivery Options Function
function showDeliveryOptions() {
  const deliveryInfo = `🚚 **Delivery Options:**\n\n` +
    `📱 **Available on:**\n` +
    `• Grab Food\n` +
    `• Now (Foody)\n` +
    `• Baemin\n\n` +
    `⏰ **Delivery Hours:**\n` +
    `10AM - 9PM Daily\n\n` +
    `📞 **Hotline:** 0326238700\n\n` +
    `💡 **Tip:** Order through your preferred delivery app for the best experience!`
  
  alert(deliveryInfo)
}

// Catering Information Function
function showCateringInfo() {
  const cateringInfo = `🍽️ **Soumaki Catering Services:**\n\n` +
    `✨ **Perfect for:**\n` +
    `• Corporate events\n` +
    `• Team meetings\n` +
    `• Private parties\n` +
    `• Health-focused gatherings\n\n` +
    `🥗 **What we offer:**\n` +
    `• Custom bowl selections\n` +
    `• Bulk orders\n` +
    `• Dietary accommodations\n` +
    `• Professional presentation\n\n` +
    `📞 **Contact for catering:**\n` +
    `Phone: 0326238700\n` +
    `Email: info@soumaki.com.vn\n\n` +
    `💼 **Minimum order:** 20 bowls\n` +
    `📅 **Advance notice:** 48 hours`
  
  alert(cateringInfo)
}

// Calories Calculator Function
function openCaloriesCalculator() {
  const calculatorInfo = `🧮 **Soumaki Calories Calculator:**\n\n` +
    `📊 **How it works:**\n` +
    `1. Choose your protein\n` +
    `2. Select your carbs\n` +
    `3. Pick your vegetables\n` +
    `4. Add your sauce\n` +
    `5. Get instant calorie count!\n\n` +
    `🎯 **Features:**\n` +
    `• Real-time calculation\n` +
    `• Macronutrient breakdown\n` +
    `• Custom portion sizes\n` +
    `• Save your favorites\n\n` +
    `🌐 **Access calculator at:**\n` +
    `soumaki.com.vn/calculator\n\n` +
    `💡 **Coming soon:** Mobile app with advanced features!`
  
  alert(calculatorInfo)
}

// Utility Functions
function scrollToSection(selector) {
  const element = document.querySelector(selector)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Contact Functions
function contactSoumaki() {
  const contactInfo = `📞 **Contact Soumaki:**\n\n` +
    `📱 **Phone:** 0326238700\n` +
    `📧 **Email:** info@soumaki.com.vn\n` +
    `🕒 **Hours:** 10AM - 9PM Daily\n\n` +
    `📍 **Visit us at:**\n` +
    `• 42 Ly Tu Trong (District 1)\n` +
    `• S27-1, Sky Garden 1 (District 7)\n` +
    `• 250 Nguyen Van Huong (District 2)\n\n` +
    `💬 **We're here to help!**\n` +
    `Questions about our bowls, catering, or anything else?`
  
  alert(contactInfo)
}

// Social Media Functions
function openSocialMedia(platform) {
  const platformInfo = {
    facebook: '📘 **Follow us on Facebook:**\n\nGet updates on new bowls, promotions, and healthy eating tips!\n\n🌐 Opening Facebook...',
    instagram: '📸 **Follow us on Instagram:**\n\nSee beautiful bowl photos, behind-the-scenes content, and customer stories!\n\n🌐 Opening Instagram...',
    tiktok: '🎵 **Follow us on TikTok:**\n\nWatch fun cooking videos, bowl assembly tutorials, and healthy lifestyle content!\n\n🌐 Opening TikTok...'
  }
  
  alert(platformInfo[platform])
}

// News and Blog Functions
function readMoreNews() {
  const newsInfo = `📰 **Soumaki News:**\n\n` +
    `🏀 **Official Partner of VBA 3x3.EXE Super Premier 2025**\n\n` +
    `We're proud to be the official nutrition partner for Vietnam's premier 3x3 basketball league!\n\n` +
    `🥗 **What we provide:**\n` +
    `• Nutritious meals for athletes\n` +
    `• Performance-focused nutrition\n` +
    `• Recovery support\n` +
    `• Energy optimization\n\n` +
    `🏆 **Supporting champions:**\n` +
    `Helping athletes maintain peak performance and break all limits!\n\n` +
    `📱 **Follow the journey:**\n` +
    `Check our social media for updates and behind-the-scenes content!`
  
  alert(newsInfo)
}

function diveIntoStory() {
  const storyInfo = `📖 **Our Story:**\n\n` +
    `🌟 **Since 2020, we've been your healthy food soulmate**\n\n` +
    `💚 **Our Mission:**\n` +
    `To help people build healthy relationships with food through delicious, nutritious bowls that nourish both body and soul.\n\n` +
    `🎯 **What makes us different:**\n` +
    `• Fresh, quality ingredients\n` +
    `• Sous-vide cooking technique\n` +
    `• Customizable nutrition\n` +
    `• Personalized guidance\n` +
    `• Love in every bowl\n\n` +
    `🤝 **Your journey with us:**\n` +
    `It's more than just eating; it's allowing your health to be heard and felt.\n\n` +
    `💫 **Join our community:**\n` +
    `Be part of a movement towards healthier, happier living!`
  
  alert(storyInfo)
}

// FAQ Function
function showFAQs() {
  const faqInfo = `❓ **Frequently Asked Questions:**\n\n` +
    `🥗 **Q: What makes Soumaki bowls healthy?**\n` +
    `A: We use fresh ingredients, sous-vide cooking, and balanced macronutrients.\n\n` +
    `⏰ **Q: What are your opening hours?**\n` +
    `A: We're open 10AM - 9PM daily at all locations.\n\n` +
    `🚚 **Q: Do you deliver?**\n` +
    `A: Yes! We're available on Grab, Now, and Baemin.\n\n` +
    `🍽️ **Q: Do you offer catering?**\n` +
    `A: Absolutely! Contact us for events and bulk orders.\n\n` +
    `📊 **Q: How do I calculate calories?**\n` +
    `A: Use our online calculator or ask our staff for help.\n\n` +
    `💳 **Q: What payment methods do you accept?**\n` +
    `A: Cash, card, and all major digital wallets.\n\n` +
    `📞 **Need more help? Call us: 0326238700**`
  
  alert(faqInfo)
}

// Console Welcome Message
console.log("%c🥗 Welcome to Soumaki! ", "background: #4CAF50; color: white; font-size: 20px; padding: 10px;")
console.log("%cYour healthy food soulmate 💚", "color: #4CAF50; font-size: 14px;")

// Hàm tạo sao vàng
function renderStars(count) {
  return '★'.repeat(count);
}

// Render danh sách reviews
function displayReviews(reviews) {
  const container = document.getElementById('reviews');
  container.innerHTML = '';

  reviews.forEach(r => {
    const card = document.createElement('div');
    card.classList.add('review-card');
    card.innerHTML = `
      <div class="review-header">
        <h3>${r.name}</h3>
        <span>${r.date}</span>
      </div>
      <div class="stars">${renderStars(r.stars)}</div>
      <p>${r.content}</p>
      <p class="source">${r.source}</p>
    `;
    container.appendChild(card);
  });
}

// Fetch dữ liệu từ JSON
fetch('../json/reviews.json')
  .then(res => {
    if (!res.ok) throw new Error('Cannot load reviews');
    return res.json();
  })
  .then(data => displayReviews(data.reviews))
  .catch(err => console.error(err));
