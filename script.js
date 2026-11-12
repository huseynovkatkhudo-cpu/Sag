
const products = [
    {id:1,name:"Футболка Basic",category:"Одежда",price:120,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"},
    {id:2,name:"Красные кроссовки",category:"Обувь",price:390,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"},
    {id:3,name:"Джинсовая куртка",category:"Одежда",price:520,image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"},
    {id:4,name:"Женская сумка",category:"Аксессуары",price:280,image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"},
    {id:5,name:"Белые кеды",category:"Обувь",price:310,image:"https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=600"},
    {id:6,name:"Рубашка",category:"Одежда",price:240,image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"},
    {id:7,name:"Солнцезащитные очки",category:"Аксессуары",price:160,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"},
    {id:8,name:"Спортивные кроссовки",category:"Обувь",price:450,image:"https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600"},
    {id:9,name:"Худи",category:"Одежда",price:290,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"},
    {id:10,name:"Рюкзак",category:"Аксессуары",price:230,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"},
    {id:11,name:"Классические туфли",category:"Обувь",price:410,image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600"},
    {id:12,name:"Свитер",category:"Одежда",price:350,image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600"}
];

let cart = [];
let activeFilter = "Все";

const productsBox = document.getElementById("products");

function notify(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function renderProducts() {
    const search = document.getElementById("search")
        .value.toLowerCase();

    const filtered = products.filter(product => {
        return (
            (activeFilter === "Все" ||
            product.category === activeFilter) &&
            product.name.toLowerCase().includes(search)
        );
    });

    productsBox.innerHTML = filtered.map(product => `
        <div class="product">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price} сомони</p>

                <button data-add="${product.id}">
                    Добавить в корзину
                </button>
            </div>
        </div>
    `).join("") || "<p>Товары не найдены</p>";
}

productsBox.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    const product = products.find(
        p => p.id === Number(button.dataset.add)
    );

    const existing = cart.find(p => p.id === product.id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({...product, qty:1});
    }

    renderCart();
    notify("Товар добавлен!");
});

function renderCart() {
    document.getElementById("cartCount").textContent =
        cart.reduce((sum, p) => sum + p.qty, 0);

    const total = cart.reduce(
        (sum, p) => sum + p.price * p.qty, 0
    );

    document.getElementById("cartTotal").textContent = total;

    document.getElementById("cartItems").innerHTML =
        cart.length
        ? cart.map(p => `
            <p>
                ${p.name} — ${p.price} сомони × ${p.qty}
                <button class="remove" data-remove="${p.id}">
                    Удалить
                </button>
            </p>
        `).join("")
        : "Корзина пустая.";
}

document.getElementById("cartItems").addEventListener("click", event => {
    const button = event.target.closest("[data-remove]");

    if (!button) return;

    cart = cart.filter(p => p.id !== Number(button.dataset.remove));
    renderCart();
});

document.getElementById("filters").addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");

    if (!button) return;

    activeFilter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach(btn => {
        btn.classList.toggle("active", btn === button);
    });

    renderProducts();
});

document.querySelectorAll(".category-tile").forEach(button => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.category;

        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.toggle(
                "active",
                btn.dataset.filter === activeFilter
            );
        });

        renderProducts();
        document.getElementById("catalog").scrollIntoView({
            behavior: "smooth"
        });
    });
});

document.getElementById("search").addEventListener("input", renderProducts);

// Открытие окон
function openModal(id) {
    document.getElementById(id).classList.add("show");
}

document.getElementById("profileOpen").onclick = () =>
    openModal("profileModal");

document.getElementById("cartOpen").onclick = () =>
    openModal("cartModal");

document.querySelectorAll("[data-close]").forEach(button => {
    button.onclick = () => {
        document.getElementById(button.dataset.close)
            .classList.remove("show");
    };
});

// Загрузка фото профиля
const avatar = document.getElementById("avatarPreview");

const savedPhoto = localStorage.getItem("modaPhoto");

if (savedPhoto) {
    avatar.innerHTML = `<img src="${savedPhoto}" alt="Фото профиля">`;
}

document.getElementById("avatarUpload").addEventListener("change", event => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        notify("Выбери фотографию");
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        avatar.innerHTML =
            `<img src="${reader.result}" alt="Фото профиля">`;

        localStorage.setItem("modaPhoto", reader.result);
    };

    reader.readAsDataURL(file);
});

// Сохранение профиля
const savedProfile = JSON.parse(
    localStorage.getItem("modaProfile") || "{}"
);

document.getElementById("profileName").value =
    savedProfile.name || "";

document.getElementById("profilePhone").value =
    savedProfile.phone || "";

document.getElementById("saveProfile").onclick = () => {
    const profile = {
        name: document.getElementById("profileName").value,
        phone: document.getElementById("profilePhone").value
    };

    localStorage.setItem("modaProfile", JSON.stringify(profile));

    document.getElementById("profileMessage").textContent =
        "Профиль успешно сохранён!";

    notify("Профиль сохранён");
};

// Оформление заказа
document.getElementById("orderBtn").onclick = () => {
    if (cart.length === 0) {
        notify("Корзина пустая!");
        return;
    }

    notify("Для настоящих заказов нужно подключить сервер.");
};

renderProducts();
renderCart();
