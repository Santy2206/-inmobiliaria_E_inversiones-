// Formulario multi-paso
document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('#lead-form');
  var stepsTrack = document.querySelector('#form-steps');
  var steps = document.querySelectorAll('.form-step');
  var stepDots = document.querySelectorAll('.step-dot');
  var stepLabel = document.querySelector('.step-label');
  var nextBtn = document.querySelector('#next-step');
  var prevBtn = document.querySelector('#prev-step');
  var success = document.querySelector('#form-success');

  var nameInput = document.querySelector('#form-name');
  var phoneInput = document.querySelector('#form-phone');
  var emailInput = document.querySelector('#form-email');
  var serviceInput = document.querySelector('#form-service');

  function setStep(n) {
    steps.forEach(function(step) {
      var stepNumber = parseInt(step.getAttribute('data-step'), 10);
      step.classList.toggle('active', stepNumber === n);
    });
    stepDots.forEach(function(dot) {
      dot.classList.toggle('active', parseInt(dot.getAttribute('data-step'), 10) === n);
    });
    if (stepLabel) stepLabel.textContent = 'Paso ' + n + ' de 2';
    if (success) success.style.display = 'none';
  }

  function showError(id, msg) {
    var el = document.querySelector(id);
    if (el) el.textContent = msg;
  }

  function clearErrors() {
    ['#error-name', '#error-phone', '#error-email', '#error-service'].forEach(function(id) {
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
      setStep(1);
    });
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      clearErrors();
      var ok = true;

      if (!validateEmail(emailInput.value)) {
        showError('#error-email', 'Ingresa un correo válido.');
        ok = false;
      }
      if (!(serviceInput.value || '')) {
        showError('#error-service', 'Selecciona un servicio.');
        ok = false;
      }

      if (ok) {
        if (stepsTrack) stepsTrack.style.display = 'none';
        var progress = document.querySelector('.form-progress');
        if (progress) progress.style.display = 'none';
        if (success) {
          success.style.display = 'block';
        }
        form.reset();
      }
    });
  }
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


// TODO: confirmar tasas con cliente/gerente antes de producción
var TASAS = {
  pacto: 0.03,
  hipoteca: 0.05
};

var formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

var montoInput = document.querySelector('#monto');
var plazoInput = document.querySelector('#plazo');
var plazoVal = document.querySelector('#plazo-val');
var resultadoMensual = document.querySelector('#resultado-mensual');
var resultadoTotal = document.querySelector('#resultado-total');
var tasaMensual = document.querySelector('#tasa-mensual');
var cta = document.querySelector('#calc-cta');

function getTipo() {
  return document.querySelector('input[name="tipo"]:checked').value;
}

function parseMonto() {
  var raw = (montoInput.value || '').replace(/\D/g, '');
  return parseInt(raw, 10) || 0;
}

function formatInput(raw) {
  var num = parseInt((raw || '').replace(/\D/g, ''), 10) || 0;
  return '$' + num.toLocaleString('es-CO');
}

function calcular() {
  var tipo = getTipo();
  var monto = parseMonto();
  var plazo = parseInt(plazoInput.value, 10);
  var tasa = TASAS[tipo];
  var mensual = monto > 0 ? Math.round(monto * tasa) : 0;
  var total = mensual * plazo;

  plazoVal.textContent = plazo;
  tasaMensual.textContent = 'Tasa del ' + (tasa * 100) + '% mensual';
  resultadoMensual.textContent = formatter.format(mensual);
  resultadoTotal.textContent = formatter.format(total) + ' en ' + plazo + ' meses';

  var mensaje = 'Hola, quiero información para invertir en ' + (tipo === 'pacto' ? 'pacto de retroventa' : 'hipoteca') +
    '. Monto: ' + formatInput(montoInput.value) + ', plazo: ' + plazo + ' meses. Ganancia mensual estimada: ' + (monto > 0 ? formatter.format(mensual) : '$0') + '.';
  cta.href = 'https://wa.me/573144049876?text=' + encodeURIComponent(mensaje);
}

if (montoInput && plazoInput) {
  montoInput.addEventListener('input', function(e) {
    var raw = (e.target.value || '').replace(/\D/g, '');
    e.target.value = raw ? '$' + parseInt(raw, 10).toLocaleString('es-CO') : '';
    calcular();
  });

  plazoInput.addEventListener('input', calcular);
  document.querySelectorAll('input[name="tipo"]').forEach(function(r) {
    r.addEventListener('change', calcular);
  });

  montoInput.value = '$' + (50000000).toLocaleString('es-CO');
  calcular();
}


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
