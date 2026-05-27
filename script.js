document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CONTROLE DO ACCORDION (EXPANSÍVEIS)
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const panel = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Alterna o estado atual
            header.setAttribute('aria-expanded', !isExpanded);
            item.classList.toggle('ativo');
            
            if (!isExpanded) {
                panel.style.display = 'block';
                panel.removeAttribute('hidden');
            } else {
                panel.style.display = 'none';
                panel.setAttribute('hidden', '');
            }
        });
    });

    /* ==========================================================================
       2. REQUISITOS DE ACESSIBILIDADE (FONTE, TEMA, VOZ)
       ========================================================================== */
    let tamanhoFonteAtual = 100; // representado em porcentagem
    const corpoPagina = document.body;

    // A. Aumentar e Diminuir Fonte
    document.getElementById('btn-aumentar').addEventListener('click', () => {
        if (tamanhoFonteAtual < 140) {
            tamanhoFonteAtual += 10;
            corpoPagina.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });

    document.getElementById('btn-diminuir').addEventListener('click', () => {
        if (tamanhoFonteAtual > 90) {
            tamanhoFonteAtual -= 10;
            corpoPagina.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });

    // B. Alternador de Tema (Claro / Escuro)
    document.getElementById('btn-tema').addEventListener('click', () => {
        corpoPagina.classList.toggle('dark-mode');
    });

    // C. Leitura por Voz (SpeechSynthesis API)
    const btnOuvir = document.getElementById('btn-ouvir');
    const btnParar = document.getElementById('btn-parar');
    let sotaqueUtterance = null;

    btnOuvir.addEventListener('click', () => {
        // Cancela qualquer leitura em andamento antes de iniciar nova
        window.speechSynthesis.cancel();

        // Captura apenas o conteúdo semântico principal (excluindo forms, botões e footer)
        const artigoPrincipal = document.getElementById('artigo-conteudo');
        
        // Remove virtualmente elementos que não devem ser lidos (como botões do accordion e forms internos)
        // Clonamos para limpar elementos textuais indesejados na leitura
        const cloneArtigo = artigoPrincipal.cloneNode(true);
        cloneArtigo.querySelectorAll('button, form, .comentarios-secao').forEach(el => el.remove());

        const textoParaLer = cloneArtigo.innerText;

        if (textoParaLer.trim() !== "") {
            sotaqueUtterance = new SpeechSynthesisUtterance(textoParaLer);
            sotaqueUtterance.lang = 'pt-BR';
            sotaqueUtterance.rate = 1.0;

            sotaqueUtterance.onstart = () => {
                btnParar.classList.remove('btn-parar-inativo');
                btnOuvir.style.borderColor = 'var(--color-verde-sustentavel)';
            };

            sotaqueUtterance.onend = () => {
                btnParar.classList.add('btn-parar-inativo');
                btnOuvir.style.borderColor = 'var(--color-azul-celeste)';
            };

            window.speechSynthesis.speak(sotaqueUtterance);
        }
    });

    btnParar.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        btnParar.classList.add('btn-parar-inativo');
        btnOuvir.style.borderColor = 'var(--color-azul-celeste)';
    });

    /* ==========================================================================
       3. FORMULÁRIO DE INSCRIÇÃO DO SEMINÁRIO
       ========================================================================== */
    const formSeminario = document.getElementById('form-seminario');
    const feedbackForm = document.getElementById('feedback-form');

    formSeminario.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulação de processamento de dados do formulário
        feedbackForm.removeAttribute('hidden');
        formSeminario.reset();

        setTimeout(() => {
            feedbackForm.setAttribute('hidden', '');
        }, 5000);
    });

    /* ==========================================================================
       4. INTERAÇÃO DE COMENTÁRIOS (DINÂMICO E ACESSÍVEL)
       ========================================================================== */
    const formComentario = document.getElementById('form-comentario');
    const txtComentario = document.getElementById('txt-comentario');
    const listaComentarios = document.getElementById('lista-comentarios');

    formComentario.addEventListener('submit', (e) => {
        e.preventDefault();

        const texto = txtComentario.value.trim();
        if (texto === '') return;

        // Criar estrutura do card de comentário moderno
        const card = document.createElement('div');
        card.classList.add('comentario-card');

        const meta = document.createElement('div');
        meta.classList.add('comentario-meta');
        meta.innerText = 'Leitor Anônimo • Agora mesmo';

        const p = document.createElement('p');
        p.innerText = texto;

        card.appendChild(meta);
        card.appendChild(p);

        // Insere o comentário no topo da lista
        listaComentarios.insertBefore(card, listaComentarios.firstChild);

        // Limpa e foca novamente na caixa de texto
        txtComentario.value = '';
    });
});