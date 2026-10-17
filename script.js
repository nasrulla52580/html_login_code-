/**
 * ئۇيغۇرچە Neumorphism كىرىش ۋە تىزىملىتىش جەدۋىلى ئۆز-ئارا تەسىر كۆرسىتىش كودى
 * 3D پىرقىراش (3D Flip & Spin) ۋە 120 FPS دەرىجىدىن تاشقىرى سىلىق نۇر سىستېمىسى بىلەن
 */

document.addEventListener('DOMContentLoaded', () => {
  // ئېلېمېنتلارنى تاللاش
  const authCard = document.getElementById('authCard');
  const loginTabBtn = document.getElementById('loginTabBtn');
  const registerTabBtn = document.getElementById('registerTabBtn');
  const tabSlider = document.getElementById('tabSlider');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  const switchCircleLogin = document.getElementById('switchCircleLogin');
  const switchCircleReg = document.getElementById('switchCircleReg');
  
  const formHeaderTitle = document.getElementById('formHeaderTitle');
  const formHeaderSubtitle = document.getElementById('formHeaderSubtitle');
  const mainHeaderIcon = document.getElementById('mainHeaderIcon');
  const brandIconInner = document.querySelector('.brand-icon-inner');

  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');

  let currentMode = 'login';
  let isSpinning = false;
  let toastTimeout = null;

  // ======================================================
  // 1. 3D پىرقىراپ ئالماشتۇرۇش فۇنكسىيەسى (3D Spin & Switch)
  // ======================================================
  function switchToTab(mode) {
    if (isSpinning || currentMode === mode) return;
    isSpinning = true;

    // پىرقىراش ئەنىماتسىيە سىنىپى قوشۇش
    const spinClass = mode === 'register' ? 'spin-to-register' : 'spin-to-login';
    authCard.classList.remove('spin-to-register', 'spin-to-login');
    void authCard.offsetWidth; // reflow قوزغىتىش
    authCard.classList.add(spinClass);

    // مەركىزىي بەلگىنى 360 گىرادۇس ئايلاندۇرۇش
    if (brandIconInner) {
      brandIconInner.style.transform = 'rotateY(360deg)';
      setTimeout(() => {
        brandIconInner.style.transform = '';
      }, 700);
    }

    // ئوتتۇرا نۇقتا (320ms - كارتىچكا 90° غا پىرقىرىغان پەيتتە جەدۋەلنى يېڭىلاش)
    setTimeout(() => {
      currentMode = mode;

      if (mode === 'login') {
        loginTabBtn.classList.add('active');
        registerTabBtn.classList.remove('active');
        tabSlider.style.transform = 'translateX(0)';

        loginForm.classList.add('active');
        registerForm.classList.remove('active');

        formHeaderTitle.textContent = 'خوش كەپسىز';
        formHeaderSubtitle.textContent = 'داۋاملاشتۇرۇش ئۈچۈن ھېساباتىڭىزغا كىرىڭ';
        mainHeaderIcon.className = 'fas fa-lock';
      } else {
        registerTabBtn.classList.add('active');
        loginTabBtn.classList.remove('active');
        tabSlider.style.transform = 'translateX(-100%)';

        registerForm.classList.add('active');
        loginForm.classList.remove('active');

        formHeaderTitle.textContent = 'ھېسابات قۇرۇش';
        formHeaderSubtitle.textContent = 'يېڭى مۇلازىمەتلەردىن بەھرىمەن بولۇش ئۈچۈن تىزىملىتىڭ';
        mainHeaderIcon.className = 'fas fa-user-plus';
      }
    }, 320);

    // ئەنىماتسىيە ئاخىرلاشقاندا سىنىپلارنى تۈگىتىش
    const onAnimationEnd = () => {
      authCard.classList.remove('spin-to-register', 'spin-to-login');
      isSpinning = false;
      authCard.removeEventListener('animationend', onAnimationEnd);
    };
    authCard.addEventListener('animationend', onAnimationEnd);
  }

  // كۇنۇپكىلارغا باغلاش
  loginTabBtn.addEventListener('click', () => switchToTab('login'));
  registerTabBtn.addEventListener('click', () => switchToTab('register'));

  if (switchCircleLogin) {
    switchCircleLogin.addEventListener('click', () => switchToTab('register'));
  }
  if (switchCircleReg) {
    switchCircleReg.addEventListener('click', () => switchToTab('login'));
  }

  // ======================================================
  // 2. پارول كۆرسىتىش / يوشۇرۇش (Password Show/Hide Toggle)
  // ======================================================
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = button.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // ======================================================
  // 3. ئۇچۇر كۆرسىتىش قەۋىتى (Toast Notification)
  // ======================================================
  function showToast(message, type = 'success') {
    clearTimeout(toastTimeout);

    toastMsg.textContent = message;
    toast.className = `toast show ${type}`;

    const icon = toast.querySelector('.toast-icon');
    if (type === 'success') {
      icon.className = 'toast-icon fas fa-check-circle';
    } else {
      icon.className = 'toast-icon fas fa-exclamation-circle';
    }

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  // ======================================================
  // 4. كىرىش جەدۋىلىنى يوللاش ۋە ئوقيانى ئۇچۇرۇش (Arrow Flight on Click)
  // ======================================================
  const submitBtns = document.querySelectorAll('.submit-btn');
  submitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.remove('fly-arrow');
      void btn.offsetWidth; // reflow قوزغىتىش
      btn.classList.add('fly-arrow');

      const icon = btn.querySelector('i');
      if (icon) {
        const onEnd = () => {
          btn.classList.remove('fly-arrow');
          icon.removeEventListener('animationend', onEnd);
        };
        icon.addEventListener('animationend', onEnd);
      }
    });
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
      showToast('ئېلخەت ياكى پارولنى كىرگۈزۈڭ!', 'error');
      return;
    }

    showToast(`كىرىش مۇۋەپپەقىيەتلىك بولدى! قارشى ئالىمىز، ${email}`, 'success');
  });

  // ======================================================
  // 5. تىزىملىتىش جەدۋىلىنى يوللاش (Register Form Submission)
  // ======================================================
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;

    if (!name || !email || !password || !confirmPassword) {
      showToast('بارلىق بۆلەكلەرنى تولۇق كىرگۈزۈڭ!', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('پارول ئەڭ ئاز دېگەندە 6 خانىلىق بولۇشى شەرت!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('پارول ئۆز-ئارا ماس كەلمىدى، قايتا تەكشۈرۈڭ!', 'error');
      return;
    }

    if (!acceptTerms) {
      showToast('مۇلازىمەت شەرتلىرىگە قوشۇلۇشىڭىز كېرەك!', 'error');
      return;
    }

    showToast(`ھۆرمەتلىك ${name}، تىزىملىتىش مۇۋەپپەقىيەتلىك تاماملاندى!`, 'success');

    // كىرىش بېتىگە 3D پىرقىراپ ئاپتوماتىك قايتىش
    setTimeout(() => {
      switchToTab('login');
      const loginEmailInput = document.getElementById('loginEmail');
      if (loginEmailInput) {
        loginEmailInput.value = email;
        loginEmailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 1500);
  });

  // ======================================================
  // 6. ئىجتىمائىي ھېساباتلار ۋە پارول ئەسلىگە كەلتۈرۈش
  // ======================================================
  const socialButtons = document.querySelectorAll('.social-btn');
  socialButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('aria-label');
      showToast(`${platform} ئارقىلىق كىرىش ئۇلىنىۋاتىدۇ...`, 'success');
    });
  });

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('پارولنى ئەسلىگە كەلتۈرۈش ئېلخېتىگە ئەۋەتىلىدۇ!', 'success');
    });
  }
});
