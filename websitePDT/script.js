// Menunggu semua konten HTML dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {

    // --- Ambil semua elemen yang kita butuhkan ---
    const searchBar = document.getElementById('search-bar');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    const orderButtons = document.querySelectorAll('.btn-pesan');
    const waitingListItems = document.getElementById('waiting-list-items');
    const totalPriceEl = document.getElementById('total-price');
    const submitOrderBtn = document.getElementById('submit-order');

    let currentTotal = 0; // Menyimpan total harga

    // --- Fungsi untuk memformat mata uang Rupiah ---
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka).replace('Rp', 'Rp '); // Tambah spasi
    }

    // --- Fungsi utama untuk memfilter dan mencari ---
    function updateMenuVisibility() {
        const searchTerm = searchBar.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

        menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            const itemCategory = item.dataset.category;

            // Cek kondisi pencarian
            const nameMatch = itemName.includes(searchTerm);
            
            // Cek kondisi filter
            const categoryMatch = (activeFilter === 'all') || (activeFilter === itemCategory);

            // Tampilkan jika kedua kondisi terpenuhi
            if (nameMatch && categoryMatch) {
                item.style.display = 'flex'; // Gunakan 'flex' karena kita atur di CSS
            } else {
                item.style.display = 'none';
            }
        });
    }

    // --- Event Listener untuk Search Bar ---
    searchBar.addEventListener('input', updateMenuVisibility);

    // --- Event Listener untuk Tombol Filter ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hapus kelas 'active' dari semua tombol
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Tambah kelas 'active' ke tombol yang diklik
            button.classList.add('active');
            
            // Panggil fungsi update
            updateMenuVisibility();
        });
    });

    // --- Event Listener untuk Tombol "Pesan" ---
    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Ambil data dari kartu menu yang diklik
            const itemCard = e.target.closest('.menu-item');
            const itemName = itemCard.querySelector('h3').textContent;
            const itemPriceEl = itemCard.querySelector('.price');
            
            const itemPriceStr = itemPriceEl.textContent; // "Rp 25.000"
            const itemPrice = parseInt(itemPriceEl.dataset.price); // Ambil dari data-price (25000)

            // 1. Tambahkan ke Waiting List (secara visual)
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${itemName}</span>
                <span>${itemPriceStr}</span>
            `;
            waitingListItems.appendChild(li);

            // 2. Update Total Harga
            currentTotal += itemPrice;
            totalPriceEl.textContent = formatRupiah(currentTotal);
            
            // Beri feedback (opsional)
            alert(`${itemName} telah ditambahkan ke waiting list!`);
        });
    });

    // --- Event Listener untuk Tombol "Kirim Pesanan" ---
    submitOrderBtn.addEventListener('click', () => {
        if (currentTotal === 0) {
            alert('Waiting list Anda masih kosong. Silakan pesan dulu.');
            return; // Hentikan fungsi
        }

        // Simulasi pengiriman pesanan
        alert(`Pesanan berhasil dikirim dengan total ${formatRupiah(currentTotal)}.\n(Ini hanya simulasi, tidak ada data yang dikirim ke server)`);

        // Reset waiting list
        waitingListItems.innerHTML = '';
        currentTotal = 0;
        totalPriceEl.textContent = formatRupiah(0);
    });

    // Inisialisasi tampilan menu saat pertama kali dimuat
    updateMenuVisibility(); 
});