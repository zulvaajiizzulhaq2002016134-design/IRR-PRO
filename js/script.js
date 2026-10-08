'use strict';
/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
  'https://delsfwkdyaexvzzxvoav.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_8Vt3ETU-oaJ1kFVoKHL_aw__aAuxKZe';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
/* ============================================================
   IRR EVENT ORGANIZER
   SCRIPT.JS — PRODUCTION VERSION
   Supabase + WhatsApp + Calendar + Reviews
============================================================ */

/* ============================================================
   1. KONFIGURASI
============================================================ */

const CONFIG = {
  supabaseUrl: 'https://delsfwkdyaexvzzxvoav.supabase.co',

  supabaseKey:
    'sb_publishable_8Vt3ETU-oaJ1kFVoKHL_aw__aAuxKZe',

  whatsapp: '6285876293847',
  whatsappDisplay: '0858-7629-3847',

  accountName: 'Indah Robiah Rohmah',

  accountInfo:
    'Nomor rekening akan diinformasikan admin melalui WhatsApp.',

  promoMinServices: 2,
  promoDiscount: 0.10
};


/* ============================================================
   2. SUPABASE CLIENT
============================================================ */

let supabaseClient = null;

function initSupabase() {
  if (!window.supabase) {
    console.error('Supabase library belum dimuat.');
    return false;
  }

  try {
    supabaseClient = window.supabase.createClient(
      CONFIG.supabaseUrl,
      CONFIG.supabaseKey
    );

    return true;
  } catch (error) {
    console.error('Gagal membuat Supabase client:', error);
    return false;
  }
}


/* ============================================================
   3. DATA LAYANAN
============================================================ */

const SERVICES = [

  {
    id: 'mc-ultah',
    icon: '🎤',
    name: 'MC Acara Ulang Tahun',
    short: 'MC Ulang Tahun',
    price: 300000,
    from: true,
    unit: null,

    desc:
      'Buat acara ulang tahun menjadi lebih seru, interaktif, dan berkesan bersama MC dari IRR Event Organizer.',

    title: 'Yang Anda dapatkan',

    items: [
      'MC interaktif dan seru',
      'Konsultasi rundown acara',
      'Konsultasi konsep acara',
      'Memandu games dan aktivitas acara',
      'Membantu menjaga alur acara tetap terarah',
      'Bonus souvenir dari IRR'
    ]
  },

  {
    id: 'mc-lamaran',
    icon: '💍',
    name: 'MC Acara Lamaran',
    short: 'MC Lamaran',
    price: 400000,
    from: true,
    unit: null,

    desc:
      'Membantu membuat prosesi lamaran berjalan lebih tertata, hangat, dan berkesan.',

    title: 'Yang Anda dapatkan',

    items: [
      'MC lamaran profesional',
      'Konsultasi rundown acara',
      'Membantu pengondisian acara',
      'Pendampingan selama acara',
      'Membantu menjaga alur prosesi tetap terarah',
      'Hadiah souvenir dari IRR'
    ]
  },

  {
    id: 'fotografer',
    icon: '📸',
    name: 'Fotografer',
    short: 'Fotografer',
    price: 500000,
    from: false,
    unit: null,

    desc:
      'Abadikan momen berharga Anda bersama fotografer yang profesional dan komunikatif.',

    title: 'Yang Anda dapatkan',

    items: [
      'Fotografer profesional dan komunikatif',
      'Unlimited shoots',
      'Pengkondisian dan arahan gaya foto',
      'Foto full editing',
      'Dokumentasi momen penting selama acara'
    ]
  },

  {
    id: 'catering-1',
    icon: '🍗',
    name: 'Catering Paket 1',
    short: 'Catering 1',
    price: 20000,
    from: false,
    unit: 'porsi',

    desc:
      'Menu praktis dan lengkap untuk berbagai kebutuhan acara.',

    title: 'Isi menu',

    items: [
      'Nasi',
      'Ayam',
      'Sayur',
      'Buah',
      'Kerupuk',
      'Sambal',
      'Air minum'
    ]
  },

  {
    id: 'catering-2',
    icon: '🍖',
    name: 'Catering Paket 2',
    short: 'Catering 2',
    price: 35000,
    from: false,
    unit: 'porsi',

    desc:
      'Pilihan menu yang lebih lengkap untuk acara spesial Anda.',

    title: 'Isi menu',

    items: [
      'Nasi',
      'Daging kambing / sapi',
      'Sup / tumisan',
      'Sambal goreng kentang',
      'Kerupuk',
      'Sambal',
      'Air minum'
    ]
  },

  {
    id: 'snack',
    icon: '🍬',
    name: 'Snack',
    short: 'Snack',
    price: 10000,
    from: false,
    unit: 'paket',

    desc:
      'Pilihan snack praktis untuk melengkapi acara Anda.',

    title: 'Isi paket',

    items: [
      'Jajanan Chiki — 3 varian',
      'Permen',
      'Air minum'
    ]
  }
];


/* ============================================================
   4. BOOKING CACHE
============================================================ */

let BOOKINGS = [];


/* ============================================================
   5. UTILITAS
============================================================ */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

const byId = id =>
  SERVICES.find(service => service.id === id);

const rupiah = value =>
  'Rp' + Math.round(value).toLocaleString('id-ID');

const pad = value =>
  String(value).padStart(2, '0');

const toISO = (year, month, day) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

const today = new Date();

const TODAY_ISO = toISO(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);


function formatDateID(iso) {

  if (!iso) return '';

  const [year, month, day] =
    iso.split('-').map(Number);

  const date =
    new Date(year, month - 1, day);

  const DAYS = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu'
  ];

  return `${DAYS[date.getDay()]}, ${day} ${MONTHS[month - 1]} ${year}`;
}


function el(tag, props = {}, ...children) {

  const node =
    document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {

    if (key === 'class') {
      node.className = value;
    }

    else if (key === 'text') {
      node.textContent = value;
    }

    else if (key === 'checked') {
      node.checked = Boolean(value);
    }

    else if (key === 'disabled') {
      node.disabled = Boolean(value);
    }

    else if (key === 'hidden') {
      node.hidden = Boolean(value);
    }

    else {
      node.setAttribute(key, value);
    }

  });

  children.forEach(child => {

    if (child) {
      node.append(child);
    }

  });

  return node;
}


/* ============================================================
   6. TOAST NOTIFICATION
============================================================ */

function showToast(message, type = 'success') {

  let toast =
    $('#irr-toast');

  if (!toast) {

    toast =
      el('div', {
        id: 'irr-toast',
        class: 'irr-toast'
      });

    document.body.append(toast);
  }

  toast.textContent = message;

  toast.dataset.type = type;

  toast.classList.add('show');

  clearTimeout(showToast.timer);

  showToast.timer =
    setTimeout(() => {

      toast.classList.remove('show');

    }, 3500);
}


/* ============================================================
   7. NAVIGASI
============================================================ */

(function initNav() {

  const toggle =
    $('#nav-toggle');

  const nav =
    $('#nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {

    const open =
      nav.classList.toggle('open');

    toggle.setAttribute(
      'aria-expanded',
      String(open)
    );

  });

  $$('a', nav).forEach(link => {

    link.addEventListener('click', () => {

      nav.classList.remove('open');

      toggle.setAttribute(
        'aria-expanded',
        'false'
      );

    });

  });

})();


/* ============================================================
   8. FOOTER / WHATSAPP / PEMBAYARAN
============================================================ */

(function initGlobalInfo() {

  const year =
    $('#year');

  if (year) {
    year.textContent =
      today.getFullYear();
  }

  const waLink =
    $('#wa-link');

  if (waLink) {

    waLink.href =
      `https://wa.me/${CONFIG.whatsapp}`;

    waLink.textContent =
      `WhatsApp ${CONFIG.whatsappDisplay}`;
  }

  const payAccount =
    $('#pay-account');

  if (payAccount) {
    payAccount.textContent =
      CONFIG.accountInfo;
  }

})();


/* ============================================================
   9. KARTU LAYANAN
============================================================ */

(function renderServices() {

  const grid =
    $('#service-grid');

  if (!grid) return;

  SERVICES.forEach(service => {

    const priceText =
      (service.from
        ? 'Mulai dari '
        : '') +
      rupiah(service.price) +
      (service.unit
        ? ` / ${service.unit}`
        : '');

    const list =
      el('ul', {
        class: 'check-list'
      });

    service.items.forEach(item => {

      list.append(
        el('li', {
          text: item
        })
      );

    });

    const card =
      el(
        'article',
        {
          class:
            'card service-card'
        },

        el(
          'div',
          {
            class:
              'service-icon',
            'aria-hidden':
              'true',
            text:
              service.icon
          }
        ),

        el(
          'h3',
          {
            text:
              service.name
          }
        ),

        el(
          'p',
          {
            class:
              'price',
            text:
              priceText
          }
        ),

        el(
          'p',
          {
            class:
              'service-desc',
            text:
              service.desc
          }
        ),

        el(
          'h4',
          {
            text:
              service.title
          }
        ),

        list,

        el(
          'a',
          {
            class:
              'btn btn-ghost',
            href:
              '#booking',
            'data-pick':
              service.id,
            text:
              'Pesan layanan ini'
          }
        )
      );

    grid.append(card);

  });

  grid.addEventListener(
    'click',
    event => {

      const button =
        event.target.closest(
          '[data-pick]'
        );

      if (!button) return;

      setServiceChecked(
        button.dataset.pick,
        true
      );

    }
  );

})();


/* ============================================================
   10. BOOKING FORM
============================================================ */

const orderForm =
  $('#order-form');

const dateInput =
  $('#event-date');

if (dateInput) {
  dateInput.min =
    TODAY_ISO;
}


/* ============================================================
   11. SERVICE OPTIONS
============================================================ */

(function renderServiceOptions() {

  const wrapper =
    $('#service-options');

  if (!wrapper) return;

  SERVICES.forEach(service => {

    const label =
      el(
        'label',
        {
          class:
            'pick',
          'data-id':
            service.id
        }
      );

    const checkbox =
      el(
        'input',
        {
          type:
            'checkbox',
          value:
            service.id,
          name:
            'service'
        }
      );

    const info =
      el(
        'span',
        {},

        el(
          'span',
          {
            class:
              'p-name',
            text:
              service.name
          }
        ),

        el(
          'span',
          {
            class:
              'p-price',
            text:
              (service.from
                ? 'Mulai dari '
                : '') +
              rupiah(service.price) +
              (service.unit
                ? ` / ${service.unit}`
                : '')
          }
        )
      );

    label.append(
      checkbox,
      info
    );

    if (service.unit) {

      const quantity =
        el(
          'span',
          {
            class:
              'qty'
          },

          document.createTextNode(
            'Jumlah'
          ),

          el(
            'input',
            {
              type:
                'number',
              min:
                '1',
              max:
                '2000',
              value:
                '50',
              'aria-label':
                `Jumlah ${service.unit} ${service.name}`
            }
          )
        );

      label.append(quantity);
    }

    wrapper.append(label);

  });

  wrapper.addEventListener(
    'change',
    updateSummary
  );

  wrapper.addEventListener(
    'input',
    updateSummary
  );


  const reviewService =
    $('#rv-service');

  if (reviewService) {

    reviewService.append(
      el(
        'option',
        {
          value:
            '',
          disabled:
            '',
          selected:
            '',
          text:
            'Pilih layanan'
        }
      )
    );

    SERVICES.forEach(service => {

      reviewService.append(
        el(
          'option',
          {
            value:
              service.name,
            text:
              service.name
          }
        )
      );

    });

    reviewService.append(
      el(
        'option',
        {
          value:
            'Lebih dari satu layanan',
          text:
            'Lebih dari satu layanan'
        }
      )
    );
  }

})();


function setServiceChecked(
  id,
  checked
) {

  const row =
    $(`.pick[data-id="${id}"]`);

  if (!row) return;

  const checkbox =
    $('input[type="checkbox"]', row);

  checkbox.checked =
    checked;

  updateSummary();

  const booking =
    $('#booking');

  if (booking) {

    setTimeout(() => {

      booking.scrollIntoView({
        behavior:
          'smooth',
        block:
          'start'
      });

    }, 100);

  }

}


function getSelection() {

  return $$('.pick')
    .filter(row => {

      const checkbox =
        $('input[type="checkbox"]', row);

      return checkbox &&
        checkbox.checked;

    })
    .map(row => {

      const service =
        byId(row.dataset.id);

      let quantity = 1;

      if (service.unit) {

        quantity =
          Math.max(
            1,
            Math.min(
              2000,
              parseInt(
                $('.qty input', row)?.value,
                10
              ) || 1
            )
          );
      }

      return {
        service,
        qty:
          quantity,
        line:
          service.price * quantity
      };

    });

}


/* ============================================================
   12. SUMMARY
============================================================ */

function updateSummary() {

  $$('.pick').forEach(row => {

    const checkbox =
      $('input[type="checkbox"]', row);

    row.classList.toggle(
      'on',
      checkbox &&
      checkbox.checked
    );

  });

  const selected =
    getSelection();

  const list =
    $('#summary-list');

  if (!list) return;

  list.replaceChildren();

  if (!selected.length) {

    list.append(
      el(
        'li',
        {
          class:
            'muted',
          text:
            'Belum ada layanan dipilih.'
        }
      )
    );

  }

  selected.forEach(
    ({
      service,
      qty,
      line
    }) => {

      const left =
        service.unit
          ? `${service.name} × ${qty} ${service.unit}`
          : service.name;

      list.append(
        el(
          'li',
          {},

          el(
            'span',
            {
              text:
                left
            }
          ),

          el(
            'span',
            {
              text:
                (service.from
                  ? '≥ '
                  : '') +
                rupiah(line)
            }
          )
        )
      );

    }
  );


  const subtotal =
    selected.reduce(
      (total, item) =>
        total + item.line,
      0
    );

  const promo =
    selected.length >=
    CONFIG.promoMinServices;

  const discount =
    promo
      ? subtotal *
        CONFIG.promoDiscount
      : 0;

  const total =
    subtotal -
    discount;


  $('#sum-subtotal').textContent =
    rupiah(subtotal);

  $('#sum-discount-row').hidden =
    !promo;

  $('#sum-discount').textContent =
    '-' +
    rupiah(discount);

  $('#sum-total').textContent =
    rupiah(total);


  const hasFrom =
    selected.some(
      item =>
        item.service.from
    );

  $('#sum-note').textContent =
    promo
      ? 'Promo 10% aktif karena Anda memilih minimal 2 layanan. Harga final dikonfirmasi admin.'
      : 'Pilih minimal 2 layanan untuk mendapat diskon 10%.' +
        (hasFrom
          ? ' Layanan MC berstatus "mulai dari".'
          : '');
}


/* ============================================================
   13. CEK TANGGAL
============================================================ */

function getBookingsForDate(date) {

  return BOOKINGS.filter(
    booking =>
      booking.event_date === date
  );

}


if (dateInput) {

  dateInput.addEventListener(
    'change',
    () => {

      const hint =
        $('#date-hint');

      if (!hint) return;

      const found =
        getBookingsForDate(
          dateInput.value
        );

      hint.classList.toggle(
        'warn-text',
        found.length > 0
      );

      if (!dateInput.value) {

        hint.textContent =
          '';

        return;
      }

      if (found.length) {

        const names =
          [
            ...new Set(
              found.flatMap(
                booking =>
                  (booking.services || [])
                    .map(item =>
                      item.short ||
                      byId(item.id)?.short ||
                      item.name
                    )
              )
            )
          ];

        hint.textContent =
          'Tanggal ini sudah memiliki booking: ' +
          names.join(', ') +
          '. Admin akan mengonfirmasi ketersediaan.';

      } else {

        hint.textContent =
          'Tanggal ini masih kosong.';
      }

    }
  );

}


/* ============================================================
   14. SIMPAN BOOKING SUPABASE
============================================================ */

async function saveBookingToDatabase(
  booking
) {

  if (!supabaseClient) {

    return {
      success:
        false,
      error:
        'Koneksi database belum tersedia.'
    };

  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from('bookings')
        .insert([
          booking
        ])
        .select()
        .single();

    if (error) {

      console.error(
        'Supabase booking error:',
        error
      );

      return {
        success:
          false,
        error:
          error.message
      };
    }

    return {
      success:
        true,
      data
    };

  } catch (error) {

    console.error(error);

    return {
      success:
        false,
      error:
        error.message
    };

  }

}


/* ============================================================
   15. SUBMIT BOOKING
============================================================ */

if (orderForm) {

  orderForm.addEventListener(
    'submit',
    async event => {

      event.preventDefault();

      const errorElement =
        $('#form-error');

      const submitButton =
        $('button[type="submit"]', orderForm);

      const name =
        $('#client-name')
          ?.value
          .trim();

      const phone =
        $('#client-phone')
          ?.value
          .trim();

      const eventType =
        $('#event-type')
          ?.value;

      const eventDate =
        dateInput
          ?.value;

      const notes =
        $('#event-notes')
          ?.value
          .trim();

      const selected =
        getSelection();


      const problems = [];


      if (!name) {
        problems.push(
          'nama lengkap'
        );
      }


      if (
        !/^[0-9+\-\s()]{8,}$/
          .test(phone)
      ) {

        problems.push(
          'nomor WhatsApp yang valid'
        );

      }


      if (!eventType) {

        problems.push(
          'jenis acara'
        );

      }


      if (!eventDate) {

        problems.push(
          'tanggal acara'
        );

      }

      else if (
        eventDate <
        TODAY_ISO
      ) {

        problems.push(
          'tanggal acara yang belum lewat'
        );

      }


      if (!selected.length) {

        problems.push(
          'minimal satu layanan'
        );

      }


      if (problems.length) {

        if (errorElement) {

          errorElement.textContent =
            'Mohon lengkapi: ' +
            problems.join(', ') +
            '.';

          errorElement.hidden =
            false;

        }

        return;
      }


      if (errorElement) {
        errorElement.hidden =
          true;
      }


      const subtotal =
        selected.reduce(
          (total, item) =>
            total + item.line,
          0
        );


      const promo =
        selected.length >=
        CONFIG.promoMinServices;


      const discount =
        promo
          ? subtotal *
            CONFIG.promoDiscount
          : 0;


      const total =
        subtotal -
        discount;


      const servicesData =
        selected.map(
          ({
            service,
            qty,
            line
          }) => ({
            id:
              service.id,

            name:
              service.name,

            quantity:
              qty,

            unit:
              service.unit,

            price:
              service.price,

            subtotal:
              line
          })
        );


      const bookingData = {

        customer_name:
          name,

        phone:
          phone,

        event_type:
          eventType,

        event_date:
          eventDate,

        services:
          servicesData,

        notes:
          notes || null,

        status:
          'Menunggu Konfirmasi'

      };


      /* Loading */

      const originalText =
        submitButton
          ?.textContent;

      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          'Menyimpan booking...';

      }


      const result =
        await saveBookingToDatabase(
          bookingData
        );


      if (submitButton) {

        submitButton.disabled =
          false;

        submitButton.textContent =
          originalText ||
          'Kirim Pesanan via WhatsApp';

      }


      if (!result.success) {

        if (errorElement) {

          errorElement.textContent =
            'Booking belum dapat disimpan. Silakan coba lagi atau langsung hubungi WhatsApp admin.';

          errorElement.hidden =
            false;

        }

        showToast(
          'Booking gagal disimpan.',
          'error'
        );

        return;
      }


      /* Masukkan booking baru ke cache */

      BOOKINGS.push(
        {
          ...bookingData,
          id:
            result.data?.id
        }
      );


      /* Pesan WhatsApp */

      const lines =
        selected.map(
          ({
            service,
            qty,
            line
          }) =>
            `- ${service.name}` +
            (
              service.unit
                ? ` × ${qty} ${service.unit}`
                : ''
            ) +
            `: ` +
            (
              service.from
                ? 'mulai '
                : ''
            ) +
            rupiah(line)
        );


      const bookingId =
        result.data?.id
          ? `#IRR-${result.data.id}`
          : '#IRR';


      const message = [

        'Halo IRR Event Organizer, saya ingin booking:',

        '',

        `ID Booking: ${bookingId}`,

        `Nama: ${name}`,

        `WhatsApp: ${phone}`,

        `Jenis acara: ${eventType}`,

        `Tanggal acara: ${formatDateID(eventDate)}`,

        '',

        'Layanan:',

        ...lines,

        '',

        `Subtotal: ${rupiah(subtotal)}`,

        promo
          ? `Diskon promo 10%: -${rupiah(discount)}`
          : '',

        `Estimasi total: ${rupiah(total)}`,

        notes
          ? `Catatan: ${notes}`
          : '',

        '',

        'Booking sudah dikirim melalui website.',

        'Mohon konfirmasi ketersediaan dan penawaran final.',

        'Terima kasih.'

      ]
        .filter(Boolean)
        .join('\n');


      showToast(
        'Booking berhasil dicatat. Membuka WhatsApp...',
        'success'
      );


      setTimeout(
        () => {

          window.open(
            `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener'
          );

        },
        500
      );


      /* Reset form */

      orderForm.reset();

      updateSummary();

    }
  );

}


/* ============================================================
   16. LOAD BOOKINGS DARI SUPABASE
============================================================ */

async function loadBookings() {

  if (!supabaseClient) {
    return;
  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from('bookings')
        .select('*')
        .eq(
          'status',
          'Terkonfirmasi'
        )
        .order(
          'event_date',
          {
            ascending:
              true
          }
        );


    if (error) {

      console.error(
        'Gagal mengambil booking:',
        error
      );

      return;
    }


    BOOKINGS =
      Array.isArray(data)
        ? data
        : [];


    if (
      window.IRRCalendarRender
    ) {

      window.IRRCalendarRender();

    }

  } catch (error) {

    console.error(
      'Load booking error:',
      error
    );

  }

}


/* ============================================================
   17. KALENDER
============================================================ */

(function initCalendar() {

  const grid =
    $('#days-grid');

  const title =
    $('#month-year');

  const detail =
    $('#day-detail');

  if (!grid || !title || !detail) {
    return;
  }


  let year =
    today.getFullYear();

  let month =
    today.getMonth();

  let selected =
    null;


  function bookingsOn(date) {

    return BOOKINGS.filter(
      booking =>
        booking.event_date === date
    );

  }


  function servicesOn(date) {

    const bookings =
      bookingsOn(date);

    const all = [];

    bookings.forEach(
      booking => {

        (
          booking.services ||
          []
        ).forEach(service => {

          const id =
            service.id ||
            service;

          if (!all.includes(id)) {
            all.push(id);
          }

        });

      }
    );

    return all;

  }


  function render() {

    title.textContent =
      `${MONTHS[month]} ${year}`;

    grid.replaceChildren();


    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();


    const total =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    for (
      let i = 0;
      i < firstDay;
      i++
    ) {

      grid.append(
        el(
          'div',
          {
            class:
              'cal-cell empty',
            'aria-hidden':
              'true'
          }
        )
      );

    }


    for (
      let day = 1;
      day <= total;
      day++
    ) {

      const iso =
        toISO(
          year,
          month,
          day
        );


      const ids =
        servicesOn(iso);


      const classes = [
        'cal-cell'
      ];


      if (iso < TODAY_ISO) {

        classes.push(
          'past'
        );

      }


      if (iso === TODAY_ISO) {

        classes.push(
          'today'
        );

      }


      if (ids.length) {

        classes.push(
          'booked'
        );

      }


      if (
        iso === selected
      ) {

        classes.push(
          'selected'
        );

      }


      const names =
        ids
          .map(id =>
            byId(id)?.short ||
            id
          );


      const aria =
        `${formatDateID(iso)}. ` +
        (
          names.length
            ? `Booking: ${names.join(', ')}`
            : 'Kosong'
        );


      const cell =
        el(
          'button',
          {
            class:
              classes.join(' '),
            type:
              'button',
            'data-date':
              iso,
            'aria-label':
              aria
          },

          el(
            'span',
            {
              class:
                'num',
              text:
                String(day)
            }
          )
        );


      ids
        .slice(0, 2)
        .forEach(id => {

          cell.append(
            el(
              'span',
              {
                class:
                  'tag',
                text:
                  byId(id)?.short ||
                  id
              }
            )
          );

        });


      if (ids.length > 2) {

        cell.append(
          el(
            'span',
            {
              class:
                'tag more',
              text:
                `+${ids.length - 2}`
            }
          )
        );

      }


      grid.append(cell);

    }

  }


  function showDetail(iso) {

    detail.replaceChildren(

      el(
        'h3',
        {
          text:
            'Detail tanggal'
        }
      ),

      el(
        'p',
        {
          class:
            'detail-date',
          text:
            formatDateID(iso)
        }
      )

    );


    const bookings =
      bookingsOn(iso);


    if (!bookings.length) {

      detail.append(
        el(
          'p',
          {
            class:
              'muted',
            text:
              'Belum ada booking pada tanggal ini.'
          }
        )
      );

    }

    else {

      bookings.forEach(
        booking => {

          const names =
            (
              booking.services ||
              []
            )
              .map(service => {

                const id =
                  service.id ||
                  service;

                return (
                  service.name ||
                  byId(id)?.name ||
                  id
                );

              });


          detail.append(

            el(
              'div',
              {
                class:
                  'detail-item'
              },

              el(
                'strong',
                {
                  text:
                    names.join(' + ')
                }
              ),

              el(
                'span',
                {
                  class:
                    'status',
                  text:
                    booking.status ||
                    'Terkonfirmasi'
                }
              )

            )

          );

        }
      );


      detail.append(
        el(
          'p',
          {
            class:
              'fine',
            text:
              'Satu tanggal dapat memiliki beberapa layanan. Hubungi kami untuk memastikan ketersediaan.'
          }
        )
      );

    }


    if (iso >= TODAY_ISO) {

      const button =
        el(
          'button',
          {
            class:
              'btn btn-primary',
            type:
              'button',
            text:
              'Booking tanggal ini'
          }
        );


      button.addEventListener(
        'click',
        () => {

          if (dateInput) {

            dateInput.value =
              iso;

            dateInput.dispatchEvent(
              new Event(
                'change'
              )
            );

          }


          $('#booking')
            ?.scrollIntoView({
              behavior:
                'smooth'
            });

        }
      );


      detail.append(button);

    }

  }


  grid.addEventListener(
    'click',
    event => {

      const cell =
        event.target.closest(
          '.cal-cell[data-date]'
        );

      if (!cell) return;

      selected =
        cell.dataset.date;

      render();

      showDetail(selected);

    }
  );


  $('#prev-month')
    ?.addEventListener(
      'click',
      () => {

        month--;

        if (month < 0) {

          month = 11;
          year--;

        }

        render();

      }
    );


  $('#next-month')
    ?.addEventListener(
      'click',
      () => {

        month++;

        if (month > 11) {

          month = 0;
          year++;

        }

        render();

      }
    );


  window.IRRCalendarRender =
    render;


  render();

})();


/* ============================================================
   18. REVIEWS
============================================================ */

(function initReviews() {

  const KEY =
    'irr_reviews_v2';

  const list =
    $('#review-list');

  const form =
    $('#review-form');

  const text =
    $('#rv-text');

  if (!list || !form || !text) {
    return;
  }


  function loadReviews() {

    try {

      return JSON.parse(
        localStorage.getItem(KEY)
      ) || [];

    } catch (_) {

      return [];

    }

  }


  function saveReview(review) {

    const all =
      loadReviews();

    all.unshift(review);

    try {

      localStorage.setItem(
        KEY,
        JSON.stringify(
          all.slice(0, 100)
        )
      );

      return true;

    } catch (_) {

      return false;

    }

  }


  function starsNode(rating) {

    const wrapper =
      el(
        'span',
        {
          class:
            'stars',
          'aria-label':
            `${rating} dari 5 bintang`
        }
      );


    for (
      let i = 1;
      i <= 5;
      i++
    ) {

      wrapper.append(
        el(
          'span',
          {
            class:
              i <= rating
                ? ''
                : 'off',
            text:
              '★',
            'aria-hidden':
              'true'
          }
        )
      );

    }

    return wrapper;

  }


  function render() {

    const reviews =
      loadReviews();

    list.replaceChildren();


    const summary =
      $('#rating-summary');

    if (summary) {

      summary.hidden =
        !reviews.length;

    }


    if (!reviews.length) {

      list.append(
        el(
          'div',
          {
            class:
              'empty-state',
            text:
              'Belum ada ulasan. Jadilah yang pertama menulis ulasan!'
          }
        )
      );

      return;

    }


    const average =
      reviews.reduce(
        (total, review) =>
          total +
          Number(review.rating),
        0
      ) /
      reviews.length;


    $('#avg-score').textContent =
      average.toFixed(1);


    $('#avg-stars')
      .replaceChildren(
        starsNode(
          Math.round(average)
        )
      );


    $('#avg-count').textContent =
      `${reviews.length} ulasan`;


    reviews.forEach(review => {

      const date =
        new Date(
          review.createdAt
        );


      const dateText =
        `${date.getDate()} ` +
        `${MONTHS[date.getMonth()]} ` +
        `${date.getFullYear()}`;


      list.append(

        el(
          'article',
          {
            class:
              'review'
          },

          el(
            'div',
            {
              class:
                'review-top'
            },

            el(
              'div',
              {
                class:
                  'avatar',
                'aria-hidden':
                  'true',
                text:
                  (
                    review.name?.[0] ||
                    '?'
                  ).toUpperCase()
              }
            ),

            el(
              'div',
              {},

              el(
                'strong',
                {
                  text:
                    review.name
                }
              ),

              el(
                'small',
                {
                  text:
                    `${review.service} · ${dateText}`
                }
              )

            )

          ),

          starsNode(
            Number(
              review.rating
            )
          ),

          el(
            'p',
            {
              text:
                review.text
            }
          )

        )

      );

    });

  }


  text.addEventListener(
    'input',
    () => {

      const counter =
        $('#rv-count');

      if (counter) {

        counter.textContent =
          text.value.length;

      }

    }
  );


  form.addEventListener(
    'submit',
    event => {

      event.preventDefault();


      const error =
        $('#rv-error');


      const name =
        $('#rv-name')
          ?.value
          .trim();


      const service =
        $('#rv-service')
          ?.value;


      const rating =
        $('input[name="rating"]:checked', form);


      const body =
        text.value.trim();


      const problems = [];


      if (!name) {
        problems.push(
          'nama'
        );
      }


      if (!service) {
        problems.push(
          'layanan'
        );
      }


      if (!rating) {
        problems.push(
          'penilaian bintang'
        );
      }


      if (body.length < 10) {

        problems.push(
          'ulasan minimal 10 karakter'
        );

      }


      if (problems.length) {

        if (error) {

          error.textContent =
            'Mohon lengkapi: ' +
            problems.join(', ') +
            '.';

          error.hidden =
            false;

        }

        return;

      }


      if (error) {
        error.hidden =
          true;
      }


      const saved =
        saveReview({

          name,

          service,

          rating:
            Number(
              rating.value
            ),

          text:
            body,

          createdAt:
            Date.now()

        });


      if (!saved) {

        if (error) {

          error.textContent =
            'Ulasan tidak dapat disimpan pada browser ini.';

          error.hidden =
            false;

        }

        return;

      }


      form.reset();

      $('#rv-count').textContent =
        '0';


      render();


      showToast(
        'Ulasan berhasil ditambahkan.',
        'success'
      );


      list.scrollIntoView({
        behavior:
          'smooth',
        block:
          'start'
      });

    }
  );


  render();

})();


/* ============================================================
   19. FLOATING WHATSAPP
============================================================ */

(function initFloatingWhatsApp() {

  if ($('#irr-floating-wa')) {
    return;
  }

  const button =
    el(
      'a',
      {
        id:
          'irr-floating-wa',

        href:
          `https://wa.me/${CONFIG.whatsapp}`,

        target:
          '_blank',

        rel:
          'noopener',

        'aria-label':
          'Hubungi IRR Event Organizer melalui WhatsApp',

        title:
          'Chat WhatsApp'
      },

      el(
        'span',
        {
          text:
            '☏'
        }
      )
    );


  document.body.append(
    button
  );

})();


/* ============================================================
   20. INITIALIZATION
============================================================ */

(async function initApp() {

  updateSummary();

  const connected =
    initSupabase();


  if (!connected) {

    showToast(
      'Mode database belum aktif.',
      'error'
    );

    return;

  }


  await loadBookings();

})();
