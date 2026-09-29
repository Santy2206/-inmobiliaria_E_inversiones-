// Formulario multi-paso
document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('#lead-form');
  if (!form) return;

  var stepsTrack = document.querySelector('#form-steps');
  var steps = document.querySelectorAll('.form-step');
  var stepDots = document.querySelectorAll('.step-dot');
  var stepLabel = document.querySelector('.step-label');
  var progress = document.querySelector('.form-progress');
  var nextBtn = document.querySelector('#next-step');
  var prevBtn = document.querySelector('#prev-step');
  var submitBtn = document.querySelector('#submit-lead');
  var success = document.querySelector('#form-success');

  var nameInput = document.querySelector('#form-name');
  var phoneInput = document.querySelector('#form-phone');
  var emailInput = document.querySelector('#form-email');
  var serviceInput = document.querySelector('#form-service');
  var messageInput = document.querySelector('#form-message');

  var SERVICIOS = {
    prestamo: 'Préstamo',
    'compra-venta': 'Compra o venta',
    inversion: 'Inversión',
    avaluo: 'Avalúo',
    otro: 'Otro'
  };

  var submitDefaultLabel = submitBtn ? submitBtn.textContent : 'Enviar solicitud ↗';

  function setStep(n) {
    steps.forEach(function(step) {
      var stepNumber = parseInt(step.getAttribute('data-step'), 10);
      step.classList.toggle('active', stepNumber === n);
    });
    stepDots.forEach(function(dot) {
      dot.classList.toggle('active', parseInt(dot.getAttribute('data-step'), 10) === n);
    });
    if (stepLabel) stepLabel.textContent = 'Paso ' + n + ' de 2';
    if (success) {
      success.classList.remove('is-visible');
      success.style.display = 'none';
    }
    if (stepsTrack) stepsTrack.style.display = '';
    if (progress) progress.style.display = '';
  }

  function showError(id, msg) {
    var el = document.querySelector(id);
    if (el) el.textContent = msg;
  }

  function clearErrors() {
    ['#error-name', '#error-phone', '#error-email', '#error-service', '#error-submit'].forEach(function(id) {
      var el = document.querySelector(id);
      if (el) el.textContent = '';
    });
  }

  function validatePhone(value) {
    var digits = (value || '').replace(/\D/g, '');
    return digits.length >= 7;
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? 'Enviando...' : submitDefaultLabel;
  }

  function showSuccess() {
    if (stepsTrack) stepsTrack.style.display = 'none';
    if (progress) progress.style.display = 'none';
    if (success) {
      success.style.display = 'block';
      success.classList.add('is-visible');
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      clearErrors();
      var ok = true;
      if (!(nameInput.value || '').trim()) {
        showError('#error-name', 'Ingresa tu nombre.');
        ok = false;
      }
      if (!validatePhone(phoneInput.value)) {
        showError('#error-phone', 'Ingresa un teléfono válido.');
        ok = false;
      }
      if (ok) setStep(2);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      clearErrors();
      setStep(1);
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();

    var ok = true;
    if (!(nameInput.value || '').trim()) {
      showError('#error-name', 'Ingresa tu nombre.');
      setStep(1);
      ok = false;
    }
    if (!validatePhone(phoneInput.value)) {
      showError('#error-phone', 'Ingresa un teléfono válido.');
      setStep(1);
      ok = false;
    }
    if (!validateEmail(emailInput.value)) {
      showError('#error-email', 'Ingresa un correo válido.');
      ok = false;
    }
    if (!(serviceInput.value || '')) {
      showError('#error-service', 'Selecciona un servicio.');
      ok = false;
    }
    if (!ok) return;

    setSubmitting(true);

    var nombre = (nameInput.value || '').trim();
    var digitosTelefono = (phoneInput.value || '').replace(/\D/g, '');
    if (digitosTelefono.length === 10) digitosTelefono = '57' + digitosTelefono;
    var whatsappLink = digitosTelefono ? 'https://wa.me/' + digitosTelefono : '';

    var payload = {
      name: nombre,
      email: emailInput.value,
      phone: phoneInput.value,
      'Nombre': nombre,
      'Teléfono': phoneInput.value,
      'Correo': emailInput.value,
      'Servicio de interés': SERVICIOS[serviceInput.value] || serviceInput.value,
      'Mensaje': (messageInput.value || '').trim() || 'Sin mensaje',
      'Escribir por WhatsApp': whatsappLink,
      _subject: 'Nuevo contacto de ' + nombre + ' - Inmobiliaria MADC',
      _replyto: emailInput.value,
      _captcha: 'false',
      _template: 'table'
    };

    fetch('https://formsubmit.co/ajax/soporte@inmobiliariamadc.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(function(response) {
      return response.json().catch(function() {
        return {};
      }).then(function(data) {
        if (!response.ok) {
          throw new Error((data && (data.message || data.error)) || 'bad response');
        }
        form.reset();
        showSuccess();
      });
    }).catch(function() {
      showError('#error-submit', 'Hubo un problema al enviar. Intenta de nuevo o escríbenos por WhatsApp.');
    }).finally(function() {
      setSubmitting(false);
    });
  });
});



document.querySelectorAll('.faq-question').forEach(function(button){
  button.addEventListener('click', function(){
    var item = button.closest('.faq-item');
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(openItem){
      openItem.classList.remove('open');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});


var formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

var montoInput = document.querySelector('#monto');
var plazoInput = document.querySelector('#plazo');
var plazoVal = document.querySelector('#plazo-val');
var tasaInput = document.querySelector('#tasa');
var tasaVal = document.querySelector('#tasa-val');
var resultadoMensual = document.querySelector('#resultado-mensual');
var resultadoTotal = document.querySelector('#resultado-total');
var tasaMensual = document.querySelector('#tasa-mensual');
var cta = document.querySelector('#calc-cta');

function parseMonto() {
  var raw = (montoInput.value || '').replace(/\D/g, '');
  return parseInt(raw, 10) || 0;
}

function formatInput(raw) {
  var num = parseInt((raw || '').replace(/\D/g, ''), 10) || 0;
  return '$' + num.toLocaleString('es-CO');
}

function calcular() {
  var monto = parseMonto();
  var plazo = parseInt(plazoInput.value, 10);
  var tasaPct = parseFloat(tasaInput.value);
  var mensual = monto > 0 ? Math.round(monto * tasaPct / 100) : 0;
  var total = mensual * plazo;

  plazoVal.textContent = plazo;
  tasaVal.textContent = tasaPct.toLocaleString('es-CO');
  tasaMensual.textContent = 'Tasa del ' + tasaPct.toLocaleString('es-CO') + '% mensual';
  resultadoMensual.textContent = formatter.format(mensual);
  resultadoTotal.textContent = formatter.format(total) + ' en ' + plazo + ' meses';

  var mensaje = 'Hola, quiero información para invertir. Monto: ' + formatInput(montoInput.value) +
    ', plazo: ' + plazo + ' meses, tasa: ' + tasaPct + '% mensual. Ganancia mensual estimada: ' +
    (monto > 0 ? formatter.format(mensual) : '$0') + '.';
  cta.href = 'https://wa.me/573114662234?text=' + encodeURIComponent(mensaje);
}

if (montoInput && plazoInput && tasaInput) {
  montoInput.addEventListener('input', function(e) {
    var raw = (e.target.value || '').replace(/\D/g, '');
    e.target.value = raw ? '$' + parseInt(raw, 10).toLocaleString('es-CO') : '';
    calcular();
  });

  plazoInput.addEventListener('input', calcular);
  tasaInput.addEventListener('input', calcular);

  montoInput.value = '$' + (50000000).toLocaleString('es-CO');
  calcular();
}


// Calculadora para préstamos con garantía hipotecaria
var montoP = document.querySelector('#monto-p');
var plazoP = document.querySelector('#plazo-p');
var plazoValP = document.querySelector('#plazo-val-p');
var tasaP = document.querySelector('#tasa-p');
var tasaValP = document.querySelector('#tasa-val-p');
var resultadoMensualP = document.querySelector('#resultado-mensual-p');
var resultadoTotalP = document.querySelector('#resultado-total-p');
var tasaMensualP = document.querySelector('#tasa-mensual-p');
var ctaP = document.querySelector('#calc-cta-p');

function parseMontoP() {
  var raw = (montoP.value || '').replace(/\D/g, '');
  return parseInt(raw, 10) || 0;
}

function calcularPrestamo() {
  var monto = parseMontoP();
  var plazo = parseInt(plazoP.value, 10);
  var tasaPct = parseFloat(tasaP.value);
  var cuota = monto > 0 ? Math.round(monto * tasaPct / 100) : 0;
  var total = monto + cuota * plazo;

  plazoValP.textContent = plazo;
  tasaValP.textContent = tasaPct.toLocaleString('es-CO');
  tasaMensualP.textContent = 'Tasa del ' + tasaPct.toLocaleString('es-CO') + '% mensual';
  resultadoMensualP.textContent = formatter.format(cuota);
  resultadoTotalP.textContent = formatter.format(total) + ' en total (' + plazo + ' meses)';

  var mensaje = 'Hola, quiero información sobre un préstamo con garantía hipotecaria. Monto: ' + formatInput(montoP.value) +
    ', plazo: ' + plazo + ' meses, tasa: ' + tasaPct.toLocaleString('es-CO') + '% mensual. Cuota mensual estimada: ' +
    (monto > 0 ? formatter.format(cuota) : '$0') + '.';
  ctaP.href = 'https://wa.me/573114662234?text=' + encodeURIComponent(mensaje);
}

if (montoP && plazoP && tasaP) {
  montoP.addEventListener('input', function(e) {
    var raw = (e.target.value || '').replace(/\D/g, '');
    e.target.value = raw ? '$' + parseInt(raw, 10).toLocaleString('es-CO') : '';
    calcularPrestamo();
  });

  plazoP.addEventListener('input', calcularPrestamo);
  tasaP.addEventListener('input', calcularPrestamo);

  montoP.value = '$' + (100000000).toLocaleString('es-CO');
  calcularPrestamo();
}

// Alternar entre calculadora de inversión y de préstamo
document.querySelectorAll('input[name="modo"]').forEach(function(radio) {
  radio.addEventListener('change', function() {
    var modo = document.querySelector('input[name="modo"]:checked').value;
    var panelInversion = document.querySelector('#panel-inversion');
    var panelPrestamo = document.querySelector('#panel-prestamo');
    if (panelInversion) panelInversion.hidden = modo !== 'inversion';
    if (panelPrestamo) panelPrestamo.hidden = modo !== 'prestamo';
  });
});


// Carrusel del catálogo de proyectos
document.addEventListener('DOMContentLoaded', function() {
  var track = document.querySelector('#catalog-track');
  if (!track) return;

  var cards = track.querySelectorAll('.catalog-card');
  var prevBtn = document.querySelector('.catalog-arrow-prev');
  var nextBtn = document.querySelector('.catalog-arrow-next');
  var dotsWrap = document.querySelector('#catalog-dots');

  cards.forEach(function(card, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'catalog-dot';
    dot.setAttribute('aria-label', 'Ir al proyecto ' + (i + 1));
    dot.addEventListener('click', function() {
      track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll('.catalog-dot');

  function cardStep() {
    var style = getComputedStyle(track);
    var gap = parseFloat(style.columnGap || style.gap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function updateUI() {
    var maxScroll = track.scrollWidth - track.clientWidth;
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 4;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll - 4;

    var closestIndex = 0;
    var closestDist = Infinity;
    cards.forEach(function(card, i) {
      var dist = Math.abs(card.offsetLeft - track.scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === closestIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      track.scrollBy({ left: cardStep(), behavior: 'smooth' });
    });
  }

  track.addEventListener('scroll', function() {
    window.requestAnimationFrame(updateUI);
  });
  window.addEventListener('resize', updateUI);
  updateUI();
});


// Números placeholder: actualizar data-count con cifras reales del cliente
document.addEventListener('DOMContentLoaded', function() {
  var badges = document.querySelector('.hero-badges');
  if (!badges) return;

  function animateCounters() {
    badges.querySelectorAll('[data-count]').forEach(function(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1500;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var current = Math.floor(progress * target);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(badges);
  } else {
    animateCounters();
  }
});
