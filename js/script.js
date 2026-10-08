/* =========================================================
   IRR EVENT ORGANIZER
   SCRIPT.JS — PRODUCTION VERSION
   ========================================================= */

'use strict';

/* =========================================================
   1. KONFIGURASI WEBSITE
   ========================================================= */

const CONFIG = {

  /* WhatsApp admin */
  whatsapp: '6285876293847',
  whatsappDisplay: '0858-7629-3847',

  /* Rekening */
  accountName: 'Indah Robiah Rohmah',

  /*
   * Ganti dengan rekening resmi jika sudah tersedia.
   *
   * Contoh:
   * accountInfo: 'Bank BCA — 1234567890'
   */
  accountInfo:
    'Nomor rekening akan diinformasikan admin melalui WhatsApp.',

  /* Promo */
  promoMinServices: 2,
  promoDiscount: 0.10,

  /* Review */
  maxReviews: 100

};


/* =========================================================
   2. DATA LAYANAN
   ========================================================= */

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


/* =========================================================
   3. DATA BOOKING
   =========================================================

   CATATAN PENTING:

   Data di bawah hanya contoh.

   Sebelum website dipublikasikan:
   HAPUS booking contoh dan masukkan booking sebenarnya.

   Nanti pada tahap backend/database,
   data ini akan kita pindahkan ke database.
   ========================================================= */

const BOOKINGS = [

  {
    date: '2026-10-17',
    services: ['mc-ultah', 'fotografer'],
    status: 'Terkonfirmasi'
  },

  {
    date: '2026-10-24',
    services: ['mc-lamaran'],
    status: 'Terkonfirmasi'
  },

  {
    date: '2026-10-31',
    services: ['catering-2', 'snack'],
    status: 'Terkonfirmasi'
  }

];


/* =========================================================
   4. UTILITAS
   ========================================================= */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

const byId = id =>
  SERVICES.find(service => service.id === id);

const rupiah = number =>
  'Rp' + Math.round(number).toLocaleString('id-ID');

const pad = number =>
  String(number).padStart(2, '0');

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

const DAYS = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu'
];


function formatDateID(iso) {

  if (!iso) return '';

  const [year, month, day] =
    iso.split('-').map(Number);

  const date =
    new Date(year, month - 1, day);

  return `${DAYS[date.getDay()]}, ${day} ${MONTHS[month - 1]} ${year}`;
}


function el(tag, props = {}, ...children) {

  const node = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {

    if (key === 'class') {
      node.className = value;
    }

    else if (key === 'text') {
      node.textContent = value;
    }

    else if (key === 'html') {
      node.innerHTML = value;
    }

    else {
      node.setAttribute(key, value);
    }

  });

  children.forEach(child => {

    if (child !== null && child !== undefined) {
      node.append(child);
    }

  });

  return node;
}


/* =========================================================
   5. TANGGAL HARI INI
   ========================================================= */

const today = new Date();

const TODAY_ISO =
  toISO(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );


/* =========================================================
   6. NAVIGASI MOBILE
   ========================================================= */

(function initNavigation() {

  const toggle = $('#nav-toggle');
  const nav = $('#nav');

  if (!toggle || !nav) return;


  toggle.addEventListener('click', () => {

    const open =
      nav.classList.toggle('open');

    toggle.classList.toggle('active', open);

    toggle.setAttribute(
      'aria-expanded',
      String(open)
    );

    document.body.classList.toggle(
      'menu-open',
      open
    );

  });


  $$('a', nav).forEach(link => {

    link.addEventListener('click', () => {

      nav.classList.remove('open');

      toggle.classList.remove('active');

      toggle.setAttribute(
        'aria-expanded',
        'false'
      );

      document.body.classList.remove(
        'menu-open'
      );

    });

  });


  document.addEventListener('keydown', event => {

    if (event.key === 'Escape') {

      nav.classList.remove('open');

      toggle.classList.remove('active');

      toggle.setAttribute(
        'aria-expanded',
        'false'
      );

      document.body.classList.remove(
        'menu-open'
      );

    }

  });

})();


/* =========================================================
   7. INFORMASI UMUM WEBSITE
   ========================================================= */

(function initWebsiteInfo() {

  const year = $('#year');

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  const waLink = $('#wa-link');

  if (waLink) {

    waLink.href =
      `https://wa.me/${CONFIG.whatsapp}`;

    waLink.textContent =
      `WhatsApp ${CONFIG.whatsappDisplay}`;

  }


  const account =
    $('#pay-account');

  if (account) {
    account.textContent =
      CONFIG.accountInfo;
  }

})();


/* =========================================================
   8. FLOATING WHATSAPP
   ========================================================= */

(function initFloatingWhatsApp() {

  if ($('.wa-float')) return;

  const link = el(
    'a',
    {
      class: 'wa-float',
      href: `https://wa.me/${CONFIG.whatsapp}`,
      target: '_blank',
      rel: 'noopener',
      'aria-label': 'Chat WhatsApp IRR Event Organizer'
    },

    el(
      'span',
      {
        class: 'wa-float-icon',
        'aria-hidden': 'true',
        text: '💬'
      }
    ),

    el(
      'span',
      {
        class: 'wa-float-text',
        text: 'Chat WhatsApp'
      }
    )
  );

  document.body.append(link);

})();


/* =========================================================
   9. KARTU LAYANAN
   ========================================================= */

(function renderServices() {

  const grid =
    $('#service-grid');

  if (!grid) return;


  SERVICES.forEach(service => {

    const priceText =
      (service.from ? 'Mulai dari ' : '') +
      rupiah(service.price) +
      (service.unit
        ? ` / ${service.unit}`
        : '');


    const list =
      el(
        'ul',
        {
          class: 'check-list'
        }
      );


    service.items.forEach(item => {

      list.append(
        el(
          'li',
          {
            text: item
          }
        )
      );

    });


    const card =
      el(
        'article',
        {
          class: 'card service-card'
        },

        el(
          'div',
          {
            class: 'service-icon',
            'aria-hidden': 'true',
            text: service.icon
          }
        ),

        el(
          'h3',
          {
            text: service.name
          }
        ),

        el(
          'p',
          {
            class: 'price',
            text: priceText
          }
        ),

        el(
          'p',
          {
            class: 'service-desc',
            text: service.desc
          }
        ),

        el(
          'h4',
          {
            text: service.title
          }
        ),

        list,

        el(
          'a',
          {
            class: 'btn btn-ghost',
            href: '#booking',
            'data-pick': service.id,
            text: 'Pesan layanan ini'
          }
        )

      );


    grid.append(card);

  });


  grid.addEventListener(
    'click',
    event => {

      const button =
        event.target.closest('[data-pick]');

      if (!button) return;

      const id =
        button.dataset.pick;

      setServiceChecked(
        id,
        true
      );

    }
  );

})();


/* =========================================================
   10. FORM BOOKING
   ========================================================= */

const orderForm =
  $('#order-form');

const dateInput =
  $('#event-date');


if (dateInput) {

  dateInput.min =
    TODAY_ISO;

}


/* =========================================================
   11. PILIHAN LAYANAN BOOKING
   ========================================================= */

(function renderServiceOptions() {

  const wrap =
    $('#service-options');

  if (!wrap) return;


  SERVICES.forEach(service => {

    const label =
      el(
        'label',
        {
          class: 'pick',
          'data-id': service.id
        }
      );


    const checkbox =
      el(
        'input',
        {
          type: 'checkbox',
          value: service.id,
          name: 'service'
        }
      );


    const info =
      el(
        'span',
        {},

        el(
          'span',
          {
            class: 'p-name',
            text: service.name
          }
        ),

        el(
          'span',
          {
            class: 'p-price',
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

      const qty =
        el(
          'span',
          {
            class: 'qty'
          },

          document.createTextNode(
            'Jumlah'
          ),

          el(
            'input',
            {
              type: 'number',
              min: '1',
              max: '2000',
              value: '50',
              'aria-label':
                `Jumlah ${service.unit} ${service.name}`
            }
          )

        );


      label.append(qty);

    }


    wrap.append(label);

  });


  wrap.addEventListener(
    'change',
    updateSummary
  );

  wrap.addEventListener(
    'input',
    updateSummary
  );


  /* Dropdown layanan untuk ulasan */

  const reviewService =
    $('#rv-service');

  if (!reviewService) return;


  reviewService.append(
    el(
      'option',
      {
        value: '',
        disabled: '',
        selected: '',
        text: 'Pilih layanan'
      }
    )
  );


  SERVICES.forEach(service => {

    reviewService.append(
      el(
        'option',
        {
          value: service.name,
          text: service.name
        }
      )
    );

  });


  reviewService.append(
    el(
      'option',
      {
        value: 'Lebih dari satu layanan',
        text: 'Lebih dari satu layanan'
      }
    )
  );

})();


/* =========================================================
   12. CHECK / UNCHECK SERVICE
   ========================================================= */

function setServiceChecked(
  id,
  checked
) {

  const row =
    $(`.pick[data-id="${id}"]`);

  if (!row) return;


  const checkbox =
    $('input[type="checkbox"]', row);

  if (!checkbox) return;


  checkbox.checked =
    checked;


  updateSummary();


  if (checked) {

    const booking =
      $('#booking');

    if (booking) {

      setTimeout(() => {

        booking.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      }, 100);

    }

  }

}


/* =========================================================
   13. AMBIL PILIHAN LAYANAN
   ========================================================= */

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

      let qty = 1;


      if (service && service.unit) {

        const input =
          $('.qty input', row);

        qty =
          Math.max(
            1,
            Math.min(
              2000,
              parseInt(
                input?.value,
                10
              ) || 1
            )
          );

      }


      return {
        service,
        qty,
        line:
          service.price * qty
      };

    });

}


/* =========================================================
   14. UPDATE RINGKASAN
   ========================================================= */

function updateSummary() {

  const rows =
    $$('.pick');


  rows.forEach(row => {

    const checkbox =
      $('input[type="checkbox"]', row);

    row.classList.toggle(
      'on',
      checkbox?.checked === true
    );

  });


  const selection =
    getSelection();


  const list =
    $('#summary-list');

  if (!list) return;


  list.replaceChildren();


  if (!selection.length) {

    list.append(
      el(
        'li',
        {
          class: 'muted',
          text: 'Belum ada layanan dipilih.'
        }
      )
    );

  }


  selection.forEach(
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
              text: left
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
    selection.reduce(
      (total, item) =>
        total + item.line,
      0
    );


  const promo =
    selection.length >=
    CONFIG.promoMinServices;


  const discount =
    promo
      ? subtotal * CONFIG.promoDiscount
      : 0;


  const total =
    subtotal - discount;


  const subtotalEl =
    $('#sum-subtotal');

  const discountRow =
    $('#sum-discount-row');

  const discountEl =
    $('#sum-discount');

  const totalEl =
    $('#sum-total');

  const noteEl =
    $('#sum-note');


  if (subtotalEl) {
    subtotalEl.textContent =
      rupiah(subtotal);
  }


  if (discountRow) {
    discountRow.hidden =
      !promo;
  }


  if (discountEl) {
    discountEl.textContent =
      '-' + rupiah(discount);
  }


  if (totalEl) {
    totalEl.textContent =
      rupiah(total);
  }


  const hasFrom =
    selection.some(
      item => item.service.from
    );


  if (noteEl) {

    if (promo) {

      noteEl.textContent =
        'Promo 10% aktif karena Anda memilih minimal 2 layanan. Harga final dikonfirmasi admin.';

    }

    else {

      noteEl.textContent =
        'Pilih minimal 2 layanan untuk mendapat diskon 10%.' +
        (
          hasFrom
            ? ' Layanan MC berstatus "mulai dari".'
            : ''
        );

    }

  }

}


/* =========================================================
   15. CEK BOOKING TANGGAL
   ========================================================= */

if (dateInput) {

  dateInput.addEventListener(
    'change',
    () => {

      const hint =
        $('#date-hint');

      if (!hint) return;


      const found =
        BOOKINGS.filter(
          booking =>
            booking.date ===
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

        const serviceNames =
          [
            ...new Set(
              found.flatMap(
                booking =>
                  booking.services.map(
                    id =>
                      byId(id)?.short
                  )
              )
            )
          ].filter(Boolean);


        hint.textContent =
          'Tanggal ini sudah ada booking: ' +
          serviceNames.join(', ') +
          '. Admin akan mengonfirmasi ketersediaan.';

      }

      else {

        hint.textContent =
          'Tanggal ini masih kosong.';

      }

    }
  );

}


/* =========================================================
   16. VALIDASI NOMOR WHATSAPP
   ========================================================= */

function normalizePhone(phone) {

  return phone
    .replace(/[^\d+]/g, '')
    .trim();

}


function isValidPhone(phone) {

  const normalized =
    normalizePhone(phone);

  return /^[+]?[0-9]{8,15}$/.test(
    normalized
  );

}


/* =========================================================
   17. FORM BOOKING → WHATSAPP
   ========================================================= */

if (orderForm) {

  orderForm.addEventListener(
    'submit',
    event => {

      event.preventDefault();


      const error =
        $('#form-error');


      const name =
        $('#client-name')
          ?.value
          .trim() || '';


      const phone =
        $('#client-phone')
          ?.value
          .trim() || '';


      const type =
        $('#event-type')
          ?.value || '';


      const date =
        dateInput
          ?.value || '';


      const notes =
        $('#event-notes')
          ?.value
          .trim() || '';


      const selection =
        getSelection();


      const problems = [];


      if (!name) {
        problems.push(
          'nama lengkap'
        );
      }


      if (!isValidPhone(phone)) {

        problems.push(
          'nomor WhatsApp yang valid'
        );

      }


      if (!type) {

        problems.push(
          'jenis acara'
        );

      }


      if (!date) {

        problems.push(
          'tanggal acara'
        );

      }

      else if (date < TODAY_ISO) {

        problems.push(
          'tanggal acara yang belum lewat'
        );

      }


      if (!selection.length) {

        problems.push(
          'minimal satu layanan'
        );

      }


      if (problems.length) {

        if (error) {

          error.textContent =
            'Mohon lengkapi: ' +
            problems.join(', ') +
            '.';

          error.hidden = false;

        }

        return;

      }


      if (error) {
        error.hidden = true;
      }


      const subtotal =
        selection.reduce(
          (total, item) =>
            total + item.line,
          0
        );


      const promo =
        selection.length >=
        CONFIG.promoMinServices;


      const discount =
        promo
          ? subtotal *
            CONFIG.promoDiscount
          : 0;


      const total =
        subtotal - discount;


      const lines =
        selection.map(
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


      const message = [

        'Halo IRR Event Organizer, saya ingin booking:',

        '',

        `Nama: ${name}`,

        `WhatsApp: ${phone}`,

        `Jenis acara: ${type}`,

        `Tanggal acara: ${formatDateID(date)}`,

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

        'Mohon konfirmasi ketersediaan tanggal dan penawarannya. Terima kasih.'

      ]
        .filter(line => line !== '')
        .join('\n');


      const url =
        `https://wa.me/${CONFIG.whatsapp}` +
        `?text=${encodeURIComponent(message)}`;


      window.open(
        url,
        '_blank',
        'noopener'
      );

    }
  );

}


/* =========================================================
   18. KALENDER BOOKING
   ========================================================= */

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


  function bookingsOn(iso) {

    return BOOKINGS.filter(
      booking =>
        booking.date === iso
    );

  }


  function servicesOn(iso) {

    return [
      ...new Set(
        bookingsOn(iso)
          .flatMap(
            booking =>
              booking.services
          )
      )
    ];

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
      let index = 0;
      index < firstDay;
      index++
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


      const serviceIds =
        servicesOn(iso);


      const classes = [
        'cal-cell'
      ];


      if (iso < TODAY_ISO) {
        classes.push('past');
      }


      if (iso === TODAY_ISO) {
        classes.push('today');
      }


      if (serviceIds.length) {
        classes.push('booked');
      }


      if (iso === selected) {
        classes.push('selected');
      }


      const label =
        `${formatDateID(iso)}. ` +
        (
          serviceIds.length
            ? 'Booking: ' +
              serviceIds
                .map(
                  id =>
                    byId(id)?.short
                )
                .filter(Boolean)
                .join(', ')
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
              label
          },

          el(
            'span',
            {
              class: 'num',
              text: String(day)
            }
          )

        );


      serviceIds
        .slice(0, 2)
        .forEach(id => {

          const service =
            byId(id);

          if (!service) return;


          cell.append(
            el(
              'span',
              {
                class: 'tag',
                text: service.short
              }
            )
          );

        });


      if (serviceIds.length > 2) {

        cell.append(
          el(
            'span',
            {
              class:
                'tag more',

              text:
                `+${serviceIds.length - 2}`
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
            class: 'muted',
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
            booking.services
              .map(
                id =>
                  byId(id)?.name
              )
              .filter(Boolean)
              .join(' + ');


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
                    names
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
            class: 'fine',

            text:
              'Satu tanggal bisa dipakai beberapa layanan. Hubungi kami untuk memastikan.'
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

          if (!dateInput) return;


          dateInput.value =
            iso;


          dateInput.dispatchEvent(
            new Event(
              'change'
            )
          );


          $('#booking')
            ?.scrollIntoView({
              behavior:
                'smooth',

              block:
                'start'
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

      showDetail(
        selected
      );

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


  render();

})();


/* =========================================================
   19. SISTEM ULASAN
   ========================================================= */

(function initReviews() {

  const KEY =
    'irr_reviews_v2';


  const listEl =
    $('#review-list');

  const form =
    $('#review-form');

  const text =
    $('#rv-text');


  if (!listEl || !form || !text) {
    return;
  }


  function loadReviews() {

    try {

      const data =
        JSON.parse(
          localStorage.getItem(KEY)
        );

      if (!Array.isArray(data)) {
        return [];
      }

      return data;

    }

    catch (_) {

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
          all.slice(
            0,
            CONFIG.maxReviews
          )
        )
      );

      return true;

    }

    catch (_) {

      return false;

    }

  }


  function starsNode(rating) {

    const stars =
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
      let index = 1;
      index <= 5;
      index++
    ) {

      stars.append(
        el(
          'span',
          {
            class:
              index <= rating
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


    return stars;

  }


  function render() {

    const all =
      loadReviews();


    listEl.replaceChildren();


    const summary =
      $('#rating-summary');


    if (summary) {

      summary.hidden =
        !all.length;

    }


    if (!all.length) {

      listEl.append(
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
      all.reduce(
        (total, review) =>
          total + Number(review.rating),
        0
      ) / all.length;


    $('#avg-score').textContent =
      average.toFixed(1);


    $('#avg-stars')
      ?.replaceChildren(
        starsNode(
          Math.round(average)
        )
      );


    $('#avg-count').textContent =
      `${all.length} ulasan`;


    all.forEach(review => {

      const date =
        new Date(
          review.createdAt
        );


      const dateText =
        `${date.getDate()} ` +
        `${MONTHS[date.getMonth()]} ` +
        `${date.getFullYear()}`;


      listEl.append(

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
            Number(review.rating)
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
          .trim() || '';


      const service =
        $('#rv-service')
          ?.value || '';


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


      const success =
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


      if (!success) {

        if (error) {

          error.textContent =
            'Ulasan tidak dapat disimpan di browser ini. Silakan coba lagi.';

          error.hidden =
            false;

        }

        return;

      }


      form.reset();


      const counter =
        $('#rv-count');

      if (counter) {
        counter.textContent =
          '0';
      }


      render();


      listEl.scrollIntoView({
        behavior:
          'smooth',

        block:
          'start'
      });

    }
  );


  render();

})();


/* =========================================================
   20. INISIALISASI AWAL
   ========================================================= */

updateSummary();


/* =========================================================
   21. ERROR HANDLING DASAR
   ========================================================= */

window.addEventListener(
  'error',
  event => {

    console.warn(
      'IRR Website:',
      event.message
    );

  }
);
