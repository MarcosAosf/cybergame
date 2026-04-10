export interface QuestionItem {
  id: string;
  type: 'multiple-choice' | 'fill-blank';
  question: string;
  options?: string[];
  answer: string;
  hint: string;
  optionHints?: Record<string, string>;
}

export interface Lesson {
  id: string;
  title: string;
  theory: string;
  isChallenge?: boolean;
  questions: QuestionItem[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export const MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Camada 1: Física',
    lessons: [
      {
        id: 'l1_1',
        title: 'Cabos UTP & Categorias',
        isChallenge: false,
        theory: 'Os cabos de par trançado sem blindagem (UTP) são a espinha dorsal das redes locais (LANs). A categoria 5e (Cat5e) suporta velocidades de até 1Gbps em frequências de 100MHz. Já a categoria 6 (Cat6) suporta até 10Gbps em frequências de 250MHz (limitado a distâncias curtas de 55m). A estrutura física do Cat6 geralmente inclui um separador de plástico interno (spline) que reduz drasticamente a diafonia (crosstalk) entre os pares, melhorando a integridade do sinal ao tratar de maior quantidade de dados. Ambos têm limite padrão de 100 metros para links de canal de rede.',
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual categoria de cabo UTP possui características físicas voltadas para mitigar o crosstalk, e consegue transmitir dados até 10Gbps em curtas distâncias?',
            options: ['Cat3', 'Cat5', 'Cat5e', 'Cat6'],
            answer: 'Cat6',
            hint: 'Lembre-se da melhoria estrutural (spline) na geração superior.',
            optionHints: {
              'Cat5e': 'Atinge até 1Gbps operando a 100MHz.',
              'Cat6': 'Projetado com separador físico, alcança até 10 Gbps a distâncias limitadas.',
            }
          }
        ]
      },
      {
        id: 'l1_2',
        title: 'Padrões de Crimpagem',
        isChallenge: false,
        theory: 'O conector padrão para cabos UTP é o RJ45, que possui 8 pinos para crimpagem dos 4 pares de fios coloridos. A organização das cores segue dois padrões principais definidos pela TIA/EIA: o T568A e o T568B. No ambiente corporativo, o T568B é frequentemente adotado como padrão. A diferença entre os dois está na inversão dos pares Verde e Laranja (pinos 1-2 e 3-6). Um "cabo direto" usa o mesmo padrão nas duas pontas, enquanto um "cabo crossover" usa T568A em uma ponta e T568B na outra.',
        questions: [
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'No padrão T568B, qual é a ordem de cores do par de fios ligados aos pinos 1 e 2?',
            options: ['Verde-branco e Verde', 'Laranja-branco e Laranja', 'Azul e Azul-branco', 'Marrom-branco e Marrom'],
            answer: 'Laranja-branco e Laranja',
            hint: 'T568B adota as cores quentes para transmitir os dados iniciais.',
            optionHints: {
              'Verde-branco e Verde': 'Essa seria a posição dos pinos 1 e 2 no padrão T568A.',
              'Laranja-branco e Laranja': 'Correto para o pino 1 (branco/laranja) e pino 2 (laranja) no padrão B.',
            }
          }
        ]
      },
      {
        id: 'l1_3',
        title: 'Fibra Óptica',
        isChallenge: false,
        theory: 'Enquanto cabos de cobre usam variação de voltagem (elétrons) para modular dados, as Fibras Ópticas enviam fótons (luz), garantindo imunidade absoluta a ruídos ou Interferência Eletromagnética (EMI). A Monomodo (Single-mode) possui núcleo estreito por onde viaja apenas um "modo" de luz gerado via Laser, feita para longuíssimas distâncias. A Multimodo (Multi-mode) possui núcleo largo por onde vários feixes de luz cruzam em ângulos alternados via LED, adequada para curtas distâncias dentro do mesmo edifício ou Data Center.',
        questions: [
          {
            id: 'q3',
            type: 'multiple-choice',
            question: 'Sua empresa precisa de um cabo 100% imune a interferência eletromagnética (EMI) para conectar dois laboratórios a 50 metros de distância. Qual é a melhor opção?',
            options: ['10GBASE-T no Cat6', 'Fibra Multimodo (Multi-mode)', 'Fibra Monomodo (Single-mode)', 'Coaxial RG-6'],
            answer: 'Fibra Multimodo (Multi-mode)',
            hint: 'Precisamos de imunidade a ruídos para um trajeto de curta distância.',
            optionHints: {
              'Fibra Multimodo (Multi-mode)': 'Totalmente imune a EMI e perfeitamente dimensionada para 50 metros.',
              'Fibra Monomodo (Single-mode)': 'Também é imune a EMI, mas Laser Monomodo para 50m é subaproveitado e mais caro.',
            }
          }
        ]
      },
      {
        id: 'l1_4',
        title: 'Equipamentos L1',
        isChallenge: false,
        theory: 'Existem dispositivos que operam estritamente na Camada 1 puramente como amplificadores do espectro físico. Quando um sinal elétrico viaja distâncias longas, ele sofre atenuação. Repeater (Repetidor) regenera este sinal sujo e o envia novamente com força total. Um Hub é meramente um "Repetidor de Múltiplas Portas"; ele recebe um sinal em uma porta e, sem qualquer lógica ou roteamento, espalha fisicamente esse fluxo para TODAS as outras portas. Isso cria o que chamamos de Domínio de Colisão gigante.',
        questions: [
          {
            id: 'q4',
            type: 'multiple-choice',
            question: 'Qual é o nome dado à anomalia de rede que corre o risco de surgir em hubs multiportas porque pacotes são enviados indistintamente por todo o barramento elétrico?',
            options: ['Broadcast Storm', 'Domínio de Colisão', 'Loops de Roteamento (L3)', 'Atenuação Máxima'],
            answer: 'Domínio de Colisão',
            hint: 'Como não há isolamento inteligente entre as portas, dois computadores injetam corrente elétricas que "batem".',
            optionHints: {
              'Domínio de Colisão': 'Os nós elétricos competem pelo mesmo espaço físico e os sinais colidem.'
            }
          }
        ]
      },
      {
        id: 'l1_5',
        title: 'Topologias Físicas',
        isChallenge: false,
        theory: 'Topologia indica como a rede está geometricamente conectada. Em Barramento (Bus), todos partilham do mesmo fio principal, e se este romper, todo o sistema cai. Em Estrela (Star), há um terminal central provendo cabos dedicados a cada nó - caso uma ponta quebre, as demais seguem ativas. Em Anel (Ring), os dados caminham num loop. Em Malha Integral (Mesh), todos estão conectados entre si garantindo robustez extrema com altíssimo custo em cabeamento.',
        questions: [
          {
            id: 'q5',
            type: 'multiple-choice',
            question: 'Sua rede corporativa utiliza vários computadores conectados de forma independente a um equipamento central num andar. Se o cabo de um dos PCs for cortado, os outros PCs não perdem conectividade. De acordo com o layout, qual é a topologia estrutural adotada?',
            options: ['Barramento Clássico', 'Anel', 'Malha', 'Estrela'],
            answer: 'Estrela',
            hint: 'Eles formam um layout com linhas saindo de um centro luminoso.',
            optionHints: {
              'Estrela': 'Os ramos são dependentes apenas do nó central.',
            }
          }
        ]
      },
      {
        id: 'l1_challenge',
        title: 'Certificação: Especialista L1',
        theory: 'Nesta fase de Certificação Final da Camada Física, suas habilidades serão colocadas à prova de fogo! O exame final condensará seu entendimento prático através de 10 perguntas táticas das 5 lições ensinadas. Mostre que é fluente nos fundamentos passivos e ativos L1.',
        isChallenge: true,
        questions: [
          {
             id: 'c1',
             type: 'multiple-choice',
             question: 'Em redes Ethernet em cobre, qual grandeza física varia para codificar os bits de dados (zeros e uns)?',
             options: ['Resistência', 'Voltagem', 'Capacitância', 'Atenuação'],
             answer: 'Voltagem',
             hint: 'Ocorre uma mudança de potencial elétrico.',
          },
          {
             id: 'c2',
             type: 'multiple-choice',
             question: 'A Fibra Óptica Monomodo (Single-mode) geralmente utiliza qual fonte de luz para transmissões de longa distância?',
             options: ['LED', 'Laser', 'Fluorescente', 'Microondas'],
             answer: 'Laser',
             hint: 'Mais focado e poderoso que um LED brilhante.',
          },
          {
             id: 'c3',
             type: 'multiple-choice',
             question: 'Por que os pares de cabos em um UTP são trançados?',
             options: ['Para caber no duto', 'Para cancelar interferências', 'Para serem esticados', 'Para economizar cobre'],
             answer: 'Para cancelar interferências',
             hint: 'Eletromagnetismo de sinais opostos gera o cancelamento de ruído.',
          },
          {
             id: 'c4',
             type: 'multiple-choice',
             question: 'Indique um equipamento comissionador da Camada 1 puramente dedicado a evitar que o sinal digital se corrompa via "Atenuação" a distâncias grandes.',
             options: ['Switch', 'Repetidor', 'Firewall', 'Modem ADSL'],
             answer: 'Repetidor',
             hint: 'Seu nome literalmente expressa "fazer novamente".',
          },
          {
             id: 'c5',
             type: 'multiple-choice',
             question: 'Em uma transmissão "Baseband" (Banda Base), como o canal de transmissão é explorado na mídia?',
             options: ['Dividido em canais lógicos múltiplos', 'Usa o canal inteiro sem modulação para carregar um só sinal', 'Sinal Wi-Fi livre', 'Ocupa apenas alta frequência'],
             answer: 'Usa o canal inteiro sem modulação para carregar um só sinal',
             hint: 'A fiação transmite todos os dados de banda base integrados por vez.',
          },
          {
             id: 'c6',
             type: 'fill-blank',
             question: 'Um cabo de rede padrão com clip de acrílico nas pontas usa o famoso conector de 8 pinos chamado...',
             answer: 'RJ45',
             hint: 'Abreviação de Registered Jack 45'
          },
          {
             id: 'c7',
             type: 'multiple-choice',
             question: 'Diga a consequência direta se um cabo principal romper numa topologia pura do tipo Barramento (Bus Clássico)...',
             options: ['Apenas o nó próximo ao corte sofre falha', 'A rede inverte seu anel de dados', 'A rede inteira colapsa eletricamente', 'Uma malha compensará todo o processo'],
             answer: 'A rede inteira colapsa eletricamente',
             hint: 'Sem barramento contínuo devidamente terminado em ambos os lados, tudo cede à instabilidade e ruído.'
          },
          {
             id: 'c8',
             type: 'multiple-choice',
             question: 'Ao crimpar uma ponta do cabo no Padrão T568A e do outro lado o Padrão T568B, os fios do TX com RX serão invertidos. Os fios 1 e 2 irão se conectar aos pinos...',
             options: ['4 e 5', '7 e 8', '3 e 6', '1 e 2'],
             answer: '3 e 6',
             hint: 'Sincronização famosa que cruza os laranjas com os verdes.'
          },
          {
             id: 'c9',
             type: 'multiple-choice',
             question: 'A mudança mecânica visível adicionada nos cabos Cat6 versus o Cat5e é um separador de material sintético interno que diminui os problemas no UTP. Qual o principal problema?',
             options: ['Loop de Sinalização Multimodo', 'Problemas com Crosstalk L1 (Diafonia)', 'Defasagem F/UTP Magnética', 'Aceleração de sinal'],
             answer: 'Problemas com Crosstalk L1 (Diafonia)',
             hint: 'Isolar os pares trançados contêm a indução das correntes adjacentes.'
          },
          {
             id: 'c10',
             type: 'multiple-choice',
             question: 'Mesmo possuindo uma aparência de "Estrela" na distribuição da fiação, internamente um Hub funciona como um barramento, pois repete e espalha o pacote indistintamente originando um...',
             options: ['Anel Cíclico', 'MAC Spoof', 'Domínio de Colisões Integradas', 'Broadcast Seguro'],
             answer: 'Domínio de Colisões Integradas',
             hint: 'Um hub é literalmente um expansor de falhas de rede do domínio físico.'
          }
        ]
      }
    ]
  },
  {
    id: 'm2',
    title: 'Camada 2: Link de Dados',
    lessons: [
      {
        id: 'l2_1',
        title: 'Identidade MAC (OUI)',
        theory: 'O endereço MAC (Media Access Control) é a "impressão digital" do seu hardware de rede, operando na Camada 2. Ele é composto por 48 bits representados em hexadecimal. Os primeiros 24 bits formam o OUI (Organizationally Unique Identifier), um código que identifica globalmente o fabricante do hardware (ex: 00:00:0C é Cisco). Os 24 bits finais são atribuídos pela própria fábrica para garantir que não existam dois dispositivos com o mesmo endereço no planeta. Diferente do IP, o MAC é um endereço FÍSICO e imutável.',
        questions: [
          {
            id: 'q2_1',
            type: 'multiple-choice',
            question: 'Em um endereço MAC (48 bits), os primeiros 24 bits são conhecidos como OUI. O que essa sigla representa?',
            options: ['Optimal User Interface', 'Organizationally Unique Identifier', 'Open Universal Internet', 'Optical Unit Interface'],
            answer: 'Organizationally Unique Identifier',
            hint: 'É o código que identifica o fabricante internacionalmente.',
            optionHints: {
              'Organizationally Unique Identifier': 'Correto! É o identificador único da organização fabricante.'
            }
          }
        ]
      },
      {
        id: 'l2_2',
        title: 'Switches e Tabelas CAM',
        theory: 'Enquanto o Hub espalha dados para todos (repetidor burro), o Switch trabalha com inteligência na Camada 2. Ele utiliza uma Tabela CAM (Content Addressable Memory), também chamada de Tabela MAC, para aprender qual dispositivo está em qual porta. Ao receber um frame, o switch lê o MAC de destino: se ele já conhece a porta associada, envia os dados APENAS para ela (Unicast). Se não conhece, ele faz o "Flooding" (envia para todos exceto a origem) até descobrir quem é quem. Isso isola domínios de colisão e aumenta a segurança local.',
        questions: [
          {
            id: 'q2_2',
            type: 'multiple-choice',
            question: 'Qual é o nome da tabela de alta velocidade que o Switch utiliza para mapear Portas Físicas para Endereços MAC?',
            options: ['Tabela de Roteamento', 'Tabela CAM', 'Tabela DNS', 'Tabela de Partição'],
            answer: 'Tabela CAM',
            hint: 'Lembre-se do acrônimo para Content Addressable Memory.',
            optionHints: {
              'Tabela CAM': 'Correto! É nela que os mapeamentos L2 são armazenados dinamicamente.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'm3',
    title: 'Camada 3: Rede',
    lessons: [
      {
        id: 'l3_1',
        title: 'Roteamento & IP',
        theory: 'Em construção. Rotas, IP, e a viagem inter-redes.',
        isChallenge: false,
        questions: [{ id: 'q1', type: 'multiple-choice', question: 'Qual é o principal protocolo lógico mapeado na Camada 3?', options: ['IP', 'TCP', 'UDP', 'MAC'], answer: 'IP', hint: 'Internet Protocol' }]
      }
    ]
  },
  {
    id: 'm4',
    title: 'Camada 4: Transporte',
    lessons: [
      {
        id: 'l4_1',
        title: 'Handshakes e Portas',
        theory: 'Em construção. Segregamento de tráfego, garantia de entrega TCP vs velocidade do UDP.',
        isChallenge: false,
        questions: [{ id: 'q1', type: 'multiple-choice', question: 'Qual protocolo de transporte garante controle de fluxo e verificação de erros?', options: ['TCP', 'UDP', 'IP', 'ICMP'], answer: 'TCP', hint: 'Confiabilidade extrema.' }]
      }
    ]
  },
  {
    id: 'm5',
    title: 'Camada 5: Sessão',
    lessons: [
      {
        id: 'l5_1',
        title: 'Gerenciamento de Sessão',
        theory: 'Em construção. Organização do diálogo entre os hosts.',
        isChallenge: false,
        questions: [{ id: 'q1', type: 'fill-blank', question: 'Você conhece o acrônimo de Remote Procedure Call. Digite:', answer: 'RPC', hint: 'R...' }]
      }
    ]
  },
  {
    id: 'm6',
    title: 'Camada 6: Apresentação',
    lessons: [
      {
        id: 'l6_1',
        title: 'Formatos e Criptografia',
        theory: 'Em construção. Codificação de dados e tradução mútua.',
        isChallenge: false,
        questions: [{ id: 'q1', type: 'multiple-choice', question: 'Nesta camada, formatos comuns como imagens entram em ação. Qual desses é de imagem?', options: ['ASCII', 'JPEG', 'HTML', 'SSH'], answer: 'JPEG', hint: 'Joint Photographic Experts Group' }]
      }
    ]
  },
  {
    id: 'm7',
    title: 'Camada 7: Aplicação',
    lessons: [
      {
        id: 'l7_1',
        title: 'Interface do Usuário',
        theory: 'Em construção. Front end dos protocolos HTTP, DNS, SMTP.',
        isChallenge: false,
        questions: [{ id: 'q1', type: 'fill-blank', question: 'O protocolo que envia e-mails (porta 25) é chamado?', answer: 'SMTP', hint: 'Simple Mail Transfer Protocol' }]
      }
    ]
  },
  {
    id: 'm8',
    title: 'Cyber Security Advanced',
    lessons: [
      {
        id: 'l8_1',
        title: 'Exploitation & Recon',
        theory: 'Em construção. A arte da guerra cibernética focada em Pentesting.',
        isChallenge: false,
        questions: [{ id: 'q1', type: 'multiple-choice', question: 'O ato de buscar informações não ativas sobre um alvo é chamado de?', options: ['OSINT', 'DDoS', 'Buffer Overflow', 'XSS'], answer: 'OSINT', hint: 'Open Source Intelligence' }]
      }
    ]
  }
];
