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
        title: 'Endereçamento MAC',
        theory: 'O endereço MAC (Media Access Control) é a "impressão digital" do seu hardware de rede, operando na Camada 2. Ele é composto por 48 bits representados em hexadecimal. Os primeiros 24 bits formam o OUI (Organizationally Unique Identifier), um código que identifica globalmente o fabricante do hardware. Os 24 bits finais são atribuídos pela própria fábrica para garantir que não existam dois dispositivos com o mesmo endereço no planeta. Diferente do IP, o MAC é um endereço FÍSICO e imutável entregue no chip da placa de rede (NIC).',
        questions: [
          {
            id: 'q2_1',
            type: 'multiple-choice',
            question: 'Sua empresa comprou novos roteadores Cisco e você percebeu que todos começam com "00:00:0C". O que essa parte do endereço MAC representa?',
            options: ['Protocolo IP', 'OUI (Organizationally Unique Identifier)', 'Endereço de Broadcast', 'Mascara de Subrede'],
            answer: 'OUI (Organizationally Unique Identifier)',
            hint: 'É o identificador internacional do fabricante.',
          }
        ]
      },
      {
        id: 'l2_2',
        title: 'ARP: Resolução de Endereço',
        theory: 'O protocolo ARP (Address Resolution Protocol) é a ponte vital entre a Camada 3 (IP) e a Camada 2 (MAC). Quando seu computador quer falar com o IP 192.168.1.5 mas não sabe em qual "porta física" ele está, ele envia um ARP Request: "Quem tem este IP? Responda para meu MAC". O dono do IP responde (ARP Reply) e seu computador guarda essa informação em uma ARP Cache. Vulnerabilidades aqui permitem ataques de ARP Spoofing (MITM).',
        questions: [
          {
            id: 'q2_2',
            type: 'multiple-choice',
            question: 'Se um invasor interceptar o tráfico de rede enviando respostas ARP falsas para o switch, qual tipo de ataque ele está executando?',
            options: ['DDoS', 'Brute Force', 'ARP Spoofing / MITM', 'Phishing'],
            answer: 'ARP Spoofing / MITM',
            hint: 'Ele está "envenenando" a tabela de endereços físicos.',
          }
        ]
      },
      {
        id: 'l2_3',
        title: 'Switching & Tabelas CAM',
        theory: 'Fiferente do Hub, o Switch trabalha com inteligência na Camada 2. Ele utiliza uma Tabela CAM (Content Addressable Memory), também chamada de Tabela MAC, para aprender qual dispositivo está em qual porta. Ao receber um frame, o switch lê o MAC de destino: se ele já conhece a porta associada, envia os dados APENAS para ela (Unicast). Isso isola domínios de colisão e aumenta a segurança local.',
        questions: [
          {
            id: 'q2_3',
            type: 'multiple-choice',
            question: 'Qual é o nome da tabela de alta velocidade que o Switch utiliza para mapear Portas Físicas para Endereços MAC?',
            options: ['Tabela de Roteamento', 'Tabela CAM', 'Tabela DNS', 'Tabela ARP'],
            answer: 'Tabela CAM',
            hint: 'Lembre-se do acrônimo para "Content Addressable Memory".',
          }
        ]
      },
      {
        id: 'l2_4',
        title: 'VLANs: Segmentação Lógica',
        theory: 'VLANs (Virtual Local Area Networks) permitem que você divida um único switch físico em várias redes lógicas. Isso é crucial para segurança: o setor de "Financeiro" pode estar isolado do "Visitantes" mesmo compartilhando o mesmo hardware. O tráfego entre VLANs diferentes requer um roteador ou um Switch Layer 3 (Inter-VLAN Routing). O padrão global usado para "marcar" (identificar) os pacotes de cada VLAN em troncos de link é o IEEE 802.1Q.',
        questions: [
          {
            id: 'q2_4',
            type: 'multiple-choice',
            question: 'Ao configurar um link entre dois switches para carregar o tráfego de várias VLANs diferentes, como chamamos esse tipo de porta?',
            options: ['Porta de Acesso', 'Porta Trunk (Tronco)', 'Porta Loopback', 'Porta WAN'],
            answer: 'Porta Trunk (Tronco)',
            hint: 'Ela carrega "malas" de várias redes digitais.',
          }
        ]
      },
      {
        id: 'l2_5',
        title: 'STP: Spanning Tree Protocol',
        theory: 'Em redes L2 com redundância (vários caminhos entre switches), podem ocorrer Loops de Camada 2, gerando Broadcast Storms que derrubam a rede em segundos. O protocolo STP (IEEE 802.1D) resolve isso elegendo uma "Root Bridge" e bloqueando logicamente portas redundantes. Se um link principal falhar, o STP recalcula e abre a porta bloqueada automaticamente, garantindo alta disponibilidade sem loops.',
        questions: [
          {
            id: 'q2_5',
            type: 'multiple-choice',
            question: 'Qual é a principal função do Spanning Tree Protocol (STP)?',
            options: ['Aumentar a velocidade do Wi-Fi', 'Evitar Loops de Camada 2', 'Roteamento entre VLANs', 'Criptografar senhas'],
            answer: 'Evitar Loops de Camada 2',
            hint: 'Ele "poda" os caminhos circulares da rede.',
          }
        ]
      },
      {
        id: 'l2_challenge',
        title: 'Certificação: Especialista L2',
        theory: 'O exame final da Camada de Link de Dados validará seu domínio sobre frames, switches e topologias lógicas. Prepare-se para 10 questões críticas envolvendo protocolos industriais.',
        isChallenge: true,
        questions: [
           { id: 'c2_1', type: 'multiple-choice', question: 'Quantos bits possui um endereço MAC padrão?', options: ['32 bits', '48 bits', '64 bits', '128 bits'], answer: '48 bits', hint: '6 octetos em hexadecimal.' },
           { id: 'c2_2', type: 'multiple-choice', question: 'O que o switch faz quando recebe um frame cujo MAC de destino não está em sua tabela CAM?', options: ['Descarta o frame', 'Envia para o roteador', 'Flooding (envia para todos exceto origem)', 'Cria um MAC falso'], answer: 'Flooding (envia para todos exceto origem)', hint: 'Ele "inunda" para descobrir quem responde.' },
           { id: 'c2_3', type: 'fill-blank', question: 'Qual o código hexadecimal (OUI) mais famoso da fabricante Dell? (Pesquisa rápida: 00:...)', answer: '00:14:22', hint: 'Use 00:14:22 para este teste.' },
           { id: 'c2_4', type: 'multiple-choice', question: 'Qual protocolo IEEE define a marcação de frames em trunks de VLAN?', options: ['802.11', '802.3', '802.1Q', '802.1X'], answer: '802.1Q', hint: 'O famoso Dot1Q.' },
           { id: 'c2_5', type: 'multiple-choice', question: 'Numa topologia STP, como é chamado o switch principal que serve como referência para o cálculo dos caminhos?', options: ['Master Switch', 'Root Bridge', 'Primary Host', 'Default Gateway'], answer: 'Root Bridge', hint: 'A "Ponte Raiz".' },
           { id: 'c2_6', type: 'multiple-choice', question: 'Se você conectar dois switches entre si com dois cabos para redundância sem STP ativado, o que ocorrerá?', options: ['A velocidade dobra', 'A rede cai em um Broadcast Storm', 'O tráfego é criptografado', 'Nada acontece'], answer: 'A rede cai em um Broadcast Storm', hint: 'Os frames vão girar infinitamente no cabo.' },
           { id: 'c2_7', type: 'fill-blank', question: 'O endereço MAC de broadcast (todos os bits em 1) é representado em hexadecimal por FF:FF:FF:FF:...', answer: 'FF:FF', hint: 'Complete o final do endereço.' },
           { id: 'c2_8', type: 'multiple-choice', question: 'Em qual subcamada da Camada 2 o endereço MAC reside?', options: ['LLC (Logical Link Control)', 'MAC (Media Access Control)', 'Physical Coding Sublayer', 'IP Sublayer'], answer: 'MAC (Media Access Control)', hint: 'É o nome do próprio controle de acesso.' },
           { id: 'c2_9', type: 'multiple-choice', question: 'Através de qual protocolo um dispositivo descobre o endereço MAC de um IP destino na mesma rede local?', options: ['DNS', 'DHCP', 'ARP', 'ICMP'], answer: 'ARP', hint: 'Address Resolution Protocol.' },
           { id: 'c2_10', type: 'multiple-choice', question: 'A técnica de "Port Mirroring" (Espelhamento de Porta) em switches é usada para qual finalidade principal?', options: ['Acelerar downloads', 'Monitoramento e Sniffing de tráfego', 'Mudar o endereço MAC (Spoofing)', 'Criar novas VLANs'], answer: 'Monitoramento e Sniffing de tráfego', hint: 'Copia o tráfego de uma porta para outra para análise.' }
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
        title: 'Protocolo IP (v4 e v6)',
        theory: 'A Camada 3 é onde ocorre o endereçamento LÓGICO. O IPv4 usa 32 bits (ex: 192.168.0.1), permitindo ~4 bilhões de endereços. Devido à escassez, surgiu o IPv6 com 128 bits (ex: 2001:db8::1), oferecendo um espaço virtualmente infinito. Enquanto o MAC identifica QUEM você é, o IP identifica ONDE você está na topologia global. Pacotes nesta camada são chamados de Datagramas.',
        questions: [
          {
            id: 'q3_1',
            type: 'multiple-choice',
            question: 'Quantos bits possui um endereço IPv6?',
            options: ['32 bits', '48 bits', '64 bits', '128 bits'],
            answer: '128 bits',
            hint: 'Aumentou drasticamente em relação aos 32 bits do IPv4.',
          }
        ]
      },
      {
        id: 'l3_2',
        title: 'Roteamento e Gateway',
        theory: 'Roteadores são os "correios" da internet. Eles mantêm Tabelas de Roteamento para decidir o melhor caminho para um pacote chegar ao destino. O Default Gateway (Portal Padrão) é o endereço do roteador que seu computador usa para enviar tráfego para fora da sua rede local. Protocolos como OSPF e BGP ajudam os roteadores a "conversar" e descobrir as melhores rotas dinamicamente.',
        questions: [
          {
            id: 'q3_2',
            type: 'multiple-choice',
            question: 'Qual é o nome do endereço IP que um dispositivo usa para enviar pacotes para uma rede externa (Internet)?',
            options: ['Loopback Address', 'MAC Address', 'Default Gateway', 'Subnet Mask'],
            answer: 'Default Gateway',
            hint: 'É a sua "saída" da rede local.',
          }
        ]
      },
      {
        id: 'l3_3',
        title: 'ICMP e Ferramentas',
        theory: 'O ICMP (Internet Control Message Protocol) não carrega dados de usuário, mas mensagens de controle e erro. Ele é a base de ferramentas como PING (checa se um host está vivo) e TRACERT/TRACEROUTE (mostra todos os roteadores no caminho até o destino). Se um roteador não consegue entregar um pacote, ele envia um "Destination Unreachable" via ICMP de volta à origem.',
        questions: [
          {
            id: 'q3_3',
            type: 'multiple-choice',
            question: 'Qual utilitário você usaria para identificar em qual roteador específico um pacote está sendo descartado no caminho para o Google?',
            options: ['Ping', 'Ipconfig', 'Traceroute', 'Nslookup'],
            answer: 'Traceroute',
            hint: 'Ele rastreia o caminho salto a salto.',
          }
        ]
      },
      {
        id: 'l3_4',
        title: 'Subnetting e Máscaras',
        theory: 'Subnetting é o ato de dividir uma rede grande em redes menores. A Máscara de Subrede (Subnet Mask) define qual parte do IP identifica a rede e qual parte identifica o host. Ex: /24 (255.255.255.0) significa que os primeiros 24 bits são rede. Isso reduz o tráfego de broadcast e melhora a organização e segurança da rede.',
        questions: [
          {
            id: 'q3_4',
            type: 'multiple-choice',
            question: 'Quantos endereços de host utilizáveis existem em uma rede com máscara /24?',
            options: ['254', '256', '512', '1024'],
            answer: '254',
            hint: '2^8 - 2 (Rede e Broadcast).',
          }
        ]
      },
      {
        id: 'l3_5',
        title: 'NAT: Network Address Translation',
        theory: 'NAT permite que vários dispositivos em uma rede privada (IPs não roteáveis como 192.168.x.x) compartilhem um único endereço IP público para acessar a internet. O roteador mantém uma tabela de tradução para saber qual resposta de internet pertence a qual computador interno. Isso economiza endereços IPv4 e provê uma camada básica de segurança (ocultamento de topologia).',
        questions: [
          {
            id: 'q3_5',
            type: 'multiple-choice',
            question: 'Qual tecnologia é responsável por traduzir IPs privados em um IP público no roteador da sua casa?',
            options: ['DHCP', 'NAT', 'DNS', 'VLAN'],
            answer: 'NAT',
            hint: 'Network Address Translation.',
          }
        ]
      },
      {
        id: 'l3_challenge',
        title: 'Certificação: Especialista L3',
        theory: 'Domine o tráfego inter-redes. Este exame cobre IP, roteamento, submáscaras e ferramentas de diagnóstico de rede.',
        isChallenge: true,
        questions: [
           { id: 'c3_1', type: 'multiple-choice', question: 'Qual o tamanho de um cabeçalho fixo IPv4?', options: ['20 bytes', '40 bytes', '60 bytes', '8 bytes'], answer: '20 bytes', hint: 'Sem opções opcionais.' },
           { id: 'c3_2', type: 'fill-blank', question: 'Qual o endereço IP de loopback padrão (localhost) no IPv4?', answer: '127.0.0.1', hint: '127...' },
           { id: 'c3_3', type: 'multiple-choice', question: 'Um roteador recebe um pacote mas o valor TTL (Time To Live) chega a zero. O que ele faz?', options: ['Aumenta o TTL e envia', 'Descarta o pacote e envia erro ICMP', 'Envia para o Gateway', 'Armazena para sempre'], answer: 'Descarta o pacote e envia erro ICMP', hint: 'Evita loops infinitos.' },
           { id: 'c3_4', type: 'multiple-choice', question: 'Qual protocolo é usado para atribuir endereços IP automaticamente aos hosts?', options: ['DNS', 'DHCP', 'HTTP', 'FTP'], answer: 'DHCP', hint: 'Dynamic Host Configuration Protocol.' },
           { id: 'c3_5', type: 'fill-blank', question: 'Converta a máscara 255.255.0.0 para notação CIDR:', answer: '/16', hint: '/...' },
           { id: 'c3_6', type: 'multiple-choice', question: 'O que significa um "Roteador Layer 3"?', options: ['Um switch que entende IPs', 'Um Hub rápido', 'Um cabo de rede especial', 'Um servidor web'], answer: 'Um switch que entende IPs', hint: 'Executa funções de roteamento em hardware de switch.' },
           { id: 'c3_7', type: 'multiple-choice', question: 'Qual destes é um protocolo de roteamento dinâmico externo (Exterior Gateway Protocol) usado na espinha dorsal da Internet?', options: ['OSPF', 'BGP', 'RIP', 'EIGRP'], answer: 'BGP', hint: 'Border Gateway Protocol.' },
           { id: 'c3_8', type: 'multiple-choice', question: 'A ferramenta PING utiliza qual tipo de mensagem ICMP para testar conectividade?', options: ['Echo Request', 'Time Exceeded', 'Unreachable', 'Redirect'], answer: 'Echo Request', hint: 'Ele pede um "eco".' },
           { id: 'c3_9', type: 'multiple-choice', question: 'No IPv6, qual mecanismo substituiu o ARP para descoberta de vizinhos?', options: ['DHCPv6', 'Neighbor Discovery Protocol (NDP)', 'NAT64', 'VLAN tagging'], answer: 'Neighbor Discovery Protocol (NDP)', hint: 'NDP via ICMPv6.' },
           { id: 'c3_10', type: 'multiple-choice', question: 'O endereço 10.0.0.5 é um exemplo de:', options: ['IP Público roteável', 'IP Privado (RFC 1918)', 'Endereço MAC', 'Porta TCP'], answer: 'IP Privado (RFC 1918)', hint: 'Usado dentro de LANs.' }
        ]
      }
    ]
  },
  {
    id: 'm4',
    title: 'Camada 4: Transporte',
    lessons: [
      {
        id: 'l4_1',
        title: 'TCP vs UDP',
        theory: 'A Camada 4 decide COMO os dados serão transportados. O TCP (Transmission Control Protocol) é orientado a conexão e garante entrega via handshakes e números de sequência (ex: Web, E-mail). O UDP (User Datagram Protocol) não garante entrega nem ordem, focando apenas em velocidade (ex: Streaming, Games, DNS). Se um segmento TCP se perde, ele é retransmitido. Se um UDP se perde, o app simplesmente segue em frente.',
        questions: [
          {
            id: 'q4_1',
            type: 'multiple-choice',
            question: 'Você está desenvolvendo um aplicativo de VoIP (Voz sobre IP). Qual protocolo de transporte é mais adequado para evitar atrasos na voz?',
            options: ['TCP', 'UDP', 'IP', 'HTTP'],
            answer: 'UDP',
            hint: 'Velocidade e baixa latência são prioridade aqui.',
          }
        ]
      },
      {
        id: 'l4_2',
        title: 'Three-way Handshake',
        theory: 'Antes de enviar dados, o TCP estabelece uma conexão usando 3 passos: 1. SYN (Sincronização), 2. SYN-ACK (Sincronização e Confirmação), 3. ACK (Confirmação). Este processo garante que ambos os lados estão prontos e sincronizados. Ataques de SYN Flood tentam derrubar servidores enviando milhares de SYN sem nunca completar o terceiro passo, esgotando a memória do servidor.',
        questions: [
          {
            id: 'q4_2',
            type: 'multiple-choice',
            question: 'Qual é a sequência correta de flags enviadas para estabelecer uma nova conexão TCP?',
            options: ['ACK -> SYN -> FIN', 'SYN -> SYN-ACK -> ACK', 'FIN -> ACK -> FIN-ACK', 'PUSH -> URG -> ACK'],
            answer: 'SYN -> SYN-ACK -> ACK',
            hint: 'Sincronizar, Confirmar, Confirmar.',
          }
        ]
      },
      {
        id: 'l4_3',
        title: 'Portas e Sockets',
        theory: 'Portas permitem que múltiplas aplicações usem a rede ao mesmo tempo no mesmo IP. Portas "Bem Conhecidas" (0-1023) incluem 80 (HTTP), 443 (HTTPS), 22 (SSH). Um Socket é a combinação de IP + Porta (ex: 127.0.0.1:443). Isso permite que o sistema operacional entregue o pacote exatamente para o processo correto (ex: seu navegador vs seu Spotify).',
        questions: [
          {
            id: 'q4_3',
            type: 'fill-blank',
            question: 'Qual é o número da porta padrão utilizada pelo protocolo de transferência segura de arquivos (SSH)?',
            answer: '22',
            hint: 'Numéro baixo.'
          }
        ]
      },
      {
        id: 'l4_4',
        title: 'Controle de Fluxo e Janelas',
        theory: 'O TCP usa Windowing (Janelamento) para controlar o fluxo de dados. O receptor informa ao emissor o "tamanho da janela" (quanta memória ele tem disponível). Se o receptor estiver sobrecarregado, ele diminui a janela para pedir que o emissor envie dados mais devagar. Isso evita o congestionamento da rede e o estouro de buffer nos dispositivos finais.',
        questions: [
          {
            id: 'q4_4',
            type: 'multiple-choice',
            question: 'Como o TCP evita que um servidor rápido sobrecarregue um cliente lento com excesso de dados?',
            options: ['Enviando mais rápido', 'Aumentando o TTL', 'Através do Windowing (Janelamento)', 'Criptografando os pacotes'],
            answer: 'Através do Windowing (Janelamento)',
            hint: 'Ele ajusta o fluxo conforme a capacidade do receptor.',
          }
        ]
      },
      {
        id: 'l4_5',
        title: 'Segmentação e Reassembly',
        theory: 'A Camada de Transporte quebra os dados grandes em pedaços menores chamados Segmentos. Cada segmento recebe um Número de Sequência. Se os segmentos chegarem fora de ordem (o que acontece muito na internet), o TCP usa esses números para remontar os dados na ordem original antes de entregá-los à Camada de Aplicação.',
        questions: [
          {
            id: 'q4_5',
            type: 'multiple-choice',
            question: 'Qual campo no cabeçalho TCP permite que o destino coloque os pacotes na ordem correta, mesmo que cheguem bagunçados?',
            options: ['Número de Sequência', 'Porta de Origem', 'Checksum', 'Tamanho da Janela'],
            answer: 'Número de Sequência',
            hint: 'É como numerar as páginas de um livro.',
          }
        ]
      },
      {
        id: 'l4_challenge',
        title: 'Certificação: Especialista L4',
        theory: 'Valide seu conhecimento sobre entrega de dados, confiabilidade e fluxo. O coração do transporte moderno.',
        isChallenge: true,
        questions: [
           { id: 'c4_1', type: 'multiple-choice', question: 'Qual flag TCP é usada para encerrar graciosamente uma conexão?', options: ['FIN', 'RST', 'SYN', 'PUSH'], answer: 'FIN', hint: 'Finalizar.' },
           { id: 'c4_2', type: 'multiple-choice', question: 'O que o UDP faz se detectar um checksum inválido em um datagrama recebido?', options: ['Pede retransmissão', 'Descarta silenciosamente', 'Corrige o erro', 'Envia erro ICMP'], answer: 'Descarta silenciosamente', hint: 'Sem garantias.' },
           { id: 'c4_3', type: 'fill-blank', question: 'Qual protocolo de transporte opera na Porta 53 (DNS)?', answer: 'UDP', hint: 'Foca em velocidade.' },
           { id: 'c4_4', type: 'multiple-choice', question: 'Um ataque de porta (Port Scanning) visa descobrir o quê?', options: ['O endereço físico MAC', 'Serviços e portas abertas em um host', 'A senha do roteador', 'A cor do gabinete'], answer: 'Serviços e portas abertas em um host', hint: 'Mapeia a superfície de ataque.' },
           { id: 'c4_5', type: 'multiple-choice', question: 'Qual o valor padrão da porta utilizada pelo protocolo HTTPS?', options: ['80', '21', '443', '23'], answer: '443', hint: 'Segurança web.' },
           { id: 'c4_6', type: 'multiple-choice', question: 'Em um "Socket Error", o que provavelmente está errado?', options: ['O cabo rompeu', 'A combinação IP/Porta está inválida ou ocupada', 'O processador superaqueceu', 'O Wi-Fi desligou'], answer: 'A combinação IP/Porta está inválida ou ocupada', hint: 'Problema na interface lógica de rede.' },
           { id: 'c4_7', type: 'multiple-choice', question: 'O campo "Checksum" no transporte serve para quê?', options: ['Aumentar a velocidade', 'Detectar corrupção de dados durante o trânsito', 'Roteamento', 'Identificar o usuário'], answer: 'Detectar corrupção de dados durante o trânsito', hint: 'Verificação de integridade matemática.' },
           { id: 'c4_8', type: 'multiple-choice', question: 'Qual a diferença entre uma porta TCP e uma porta UDP com o mesmo número (ex: 53)?', options: ['Muda o IP', 'São independentes e podem coexistir', 'Não podem ser usadas juntas', 'UDP é mais rápida que TCP'], answer: 'São independentes e podem coexistir', hint: 'Pense em prédios diferentes na mesma rua.' },
           { id: 'c4_9', type: 'fill-blank', question: 'Nome da técnica TCP para enviar múltiplos segmentos antes de esperar por um ACK:', answer: 'Sliding Window', hint: 'Janela Deslizante.' },
           { id: 'c4_10', type: 'multiple-choice', question: 'O protocolo UDP é considerado...', options: ['Orientado a conexão', 'Conexão cega', 'Não orientado a conexão (Connectionless)', 'Criptografado'], answer: 'Não orientado a conexão (Connectionless)', hint: 'Apenas envia e torce.' }
        ]
      }
    ]
  },
  {
    id: 'm5',
    title: 'Camada 5: Sessão',
    lessons: [
      {
        id: 'l5_1',
        title: 'Gerenciamento de Diálogo',
        theory: 'A Camada 5 estabelece, gerencia e finaliza as sessões entre aplicações. Enquanto o Transporte (L4) cuida da entrega de pacotes, a Sessão (L5) cuida da "conversa" lógica. Ela permite que dois sistemas entrem em acordo sobre como os dados serão trocados (Simplex, Half-duplex ou Full-duplex) e mantém o contexto da interação.',
        questions: [
          {
            id: 'q5_1',
            type: 'multiple-choice',
            question: 'Qual é o principal objetivo da Camada de Sessão?',
            options: ['Roteamento de pacotes', 'Estabelecer e manter a conexão entre aplicações', 'Criptografar arquivos', 'Definir tensões elétricas'],
            answer: 'Estabelecer e manter a conexão entre aplicações',
            hint: 'Ela cuida do "diálogo" lógico.',
          }
        ]
      },
      {
        id: 'l5_2',
        title: 'RPC: Remote Procedure Call',
        theory: 'RPC (Chamada de Procedimento Remoto) é um protocolo que permite que um programa execute um código em outro computador como se fosse uma chamada local. Isso é a base dos sistemas distribuídos. Quando um servidor de arquivos Windows solicita acesso a uma pasta em outro servidor, ele frequentemente usa RPC para coordenar essa ação na Camada 5.',
        questions: [
          {
            id: 'q5_2',
            type: 'multiple-choice',
            question: 'O protocolo RPC opera em qual camada do modelo OSI?',
            options: ['Camada 2', 'Camada 3', 'Camada 5', 'Camada 7'],
            answer: 'Camada 5',
            hint: 'Ele gerencia a execução remota de funções.',
          }
        ]
      },
      {
        id: 'l5_3',
        title: 'NetBIOS e Nomes de Rede',
        theory: 'NetBIOS (Network Basic Input/Output System) foi um padrão muito comum em redes Microsoft para permitir que aplicações em diferentes computadores se comunicassem. Ele provê serviços de nomeação (identificar PCs por nomes em vez de IPs na camada de sessão). Embora antigo, seus conceitos ainda influenciam como o Windows gerencia sessões de rede local.',
        questions: [
          {
            id: 'q5_3',
            type: 'multiple-choice',
            question: 'Qual serviço de nomes clássico da Microsoft opera na Camada de Sessão?',
            options: ['DNS', 'NetBIOS', 'ARP', 'ICMP'],
            answer: 'NetBIOS',
            hint: 'Pense em "Basic Input Output System" de rede.',
          }
        ]
      },
      {
        id: 'l5_4',
        title: 'Checkpoints e Recuperação',
        theory: 'Uma função crítica da Camada 5 é a inserção de Checkpoints (Pontos de Verificação) em fluxos de dados longos. Se uma transferência de um arquivo de 1GB falhar nos 900MB, a Camada de Sessão pode usar esses checkpoints para retomar a transmissão do ponto onde parou, em vez de recomeçar do zero.',
        questions: [
          {
            id: 'q5_4',
            type: 'multiple-choice',
            question: 'Como a Camada de Sessão ajuda na transferência de arquivos gigantes que sofrem quedas de conexão?',
            options: ['Criptografando os dados', 'Através de Checkpoints (Pontos de Verificação)', 'Aumentando o sinal Wi-Fi', 'Mudando o IP do servidor'],
            answer: 'Através de Checkpoints (Pontos de Verificação)',
            hint: 'Ela permite a "retomada" de onde parou.',
          }
        ]
      },
      {
        id: 'l5_5',
        title: 'Sockets e Portas (Sessão)',
        theory: 'Embora os números de porta residam na Camada 4, a criação e destruição do "Socket de Sessão" ocorre na Camada 5. Quando uma aplicação "abre uma porta" para ouvir conexões, ela está solicitando um serviço da Camada de Sessão para gerenciar aquele fluxo de entrada e saída de forma organizada.',
        questions: [
          {
            id: 'q5_5',
            type: 'multiple-choice',
            question: 'O ato de "finalizar" uma sessão de login de um usuário no sistema ocorre em qual camada?',
            options: ['Apresentação', 'Sessão', 'Aplicação', 'Física'],
            answer: 'Sessão',
            hint: 'Terminar o diálogo lógico.',
          }
        ]
      },
      {
        id: 'l5_challenge',
        title: 'Certificação: Especialista L5',
        theory: 'Valide seu conhecimento sobre o controle de diálogos e persistência de conexões lógicas entre máquinas.',
        isChallenge: true,
        questions: [
           { id: 'c5_1', type: 'multiple-choice', question: 'Qual destas NÃO é uma função da Camada de Sessão?', options: ['Estabelecimento de sessão', 'Controle de diálogo', 'Cálculo de rotas IP', 'Sincronização via checkpoints'], answer: 'Cálculo de rotas IP', hint: 'Isso é Camada 3.' },
           { id: 'c5_2', type: 'multiple-choice', question: 'No diálogo Full-Duplex, como ocorre a comunicação na Camada 5?', options: ['Um por vez', 'Apenas em um sentido', 'Ambos transmitem simultaneamente', 'Ninguém transmite'], answer: 'Ambos transmitem simultaneamente', hint: 'Via dupla total.' },
           { id: 'c5_3', type: 'fill-blank', question: 'Sigla para Remote Procedure Call:', answer: 'RPC', hint: '...' },
           { id: 'c5_4', type: 'multiple-choice', question: 'Qual protocolo de sessão da Apple permitia a comunicação entre Macs antigos?', options: ['AppleTalk / ASP', 'HTTP', 'FTP', 'Telnet'], answer: 'AppleTalk / ASP', hint: 'ASP (AppleTalk Session Protocol).' },
           { id: 'c5_5', type: 'multiple-choice', question: 'A Camada de Sessão permite o "Address Management"?', options: ['Sim', 'Não', 'Apenas para IPs', 'Apenas para MACs'], answer: 'Não', hint: 'Endereçamento é L2 e L3.' },
           { id: 'c5_6', type: 'multiple-choice', question: 'O que o SOCKS (Protocol) faz na Camada 5?', options: ['Criptografa o disco', 'Atua como um Proxy para estabelecer sessões', 'Aumenta a RAM', 'Limpa o cache'], answer: 'Atua como um Proxy para estabelecer sessões', hint: 'Socket Secure.' },
           { id: 'c5_7', type: 'multiple-choice', question: 'A finalização de uma sessão TCP iniciada na L4 é coordenada logicamente na...', options: ['Camada 1', 'Camada 3', 'Camada 5', 'Camada 7'], answer: 'Camada 5', hint: 'Gestão da vida da conversa.' },
           { id: 'c5_8', type: 'multiple-choice', question: 'O protocolo SQL usa serviços da Camada de Sessão para manter a persistência de queries em bancos de dados?', options: ['Sim, para manter a conexão ativa', 'Não, SQL é Camada 1', 'Apenas Wi-Fi', 'Somente em redes via cabo'], answer: 'Sim, para manter a conexão ativa', hint: 'Acesso a dados remoto exige sessão.' },
           { id: 'c5_9', type: 'fill-blank', question: 'Termo para o diálogo onde apenas UM lado fala por vez:', answer: 'Half-duplex', hint: 'Pense em um Walkie-Talkie.' },
           { id: 'c5_10', type: 'multiple-choice', question: 'Os "Tokens" usados para gerenciar quem tem o direito de falar na rede operam na camada...', options: ['Física', 'Sessão', 'Aplicação', 'Datalink'], answer: 'Sessão', hint: 'Gerenciamento de turnos de diálogo.' }
        ]
      }
    ]
  },
  {
    id: 'm6',
    title: 'Camada 6: Apresentação',
    lessons: [
      {
        id: 'l6_1',
        title: 'Tradução e Formatação',
        theory: 'A Camada 6 é o "Tradutor" da rede. Diferentes computadores podem usar diferentes formas de codificar caracteres (ex: EBCDIC vs ASCII). A Camada de Apresentação garante que os dados enviados por um sistema sejam legíveis pelo outro, traduzindo entre diferentes formatos de dados.',
        questions: [
          {
            id: 'q6_1',
            type: 'multiple-choice',
            question: 'Qual camada garante que o conteúdo enviado por um host seja compreendido pelo host de destino, independentemente do sistema?',
            options: ['Rede', 'Apresentação', 'Aplicação', 'Física'],
            answer: 'Apresentação',
            hint: 'É o tradutor universal.',
          }
        ]
      },
      {
        id: 'l6_2',
        title: 'Criptografia: SSL e TLS',
        theory: 'A segurança dos dados em trânsito (Criptografia) é uma função primária da Camada 6. Protocolos como SSL (Secure Sockets Layer) e seu sucessor TLS (Transport Layer Security) codificam os dados antes de serem enviados pelas camadas inferiores, garantindo que apenas o destinatário correto possa ler a mensagem.',
        questions: [
          {
            id: 'q6_2',
            type: 'multiple-choice',
            question: 'Qual o papel principal do TLS na Camada de Apresentação?',
            options: ['Aumentar a velocidade', 'Criptografar e proteger dados', 'Definir o IP do servidor', 'Trocar cabos de rede'],
            answer: 'Criptografar e proteger dados',
            hint: 'Segurança e codificação.',
          }
        ]
      },
      {
        id: 'l6_3',
        title: 'Compressão de Dados',
        theory: 'Para economizar largura de banda e acelerar a rede, a Camada 6 realiza a compressão dos dados. Ao "espremer" as informações antes do envio e "descomprimir" na chegada, os sistemas conseguem transmitir muito mais informação física no mesmo intervalo de tempo.',
        questions: [
          {
            id: 'q6_3',
            type: 'multiple-choice',
            question: 'Por que a compressão é feita na Camada 6?',
            options: ['Para esconder o IP', 'Para reduzir o tamanho dos dados e otimizar a rede', 'Para evitar vírus', 'Para mudar o MAC address'],
            answer: 'Para reduzir o tamanho dos dados e otimizar a rede',
            hint: 'Eficiência de transmissão.',
          }
        ]
      },
      {
        id: 'l6_4',
        title: 'JSON, XML e Imagens',
        theory: 'Formatos de dados universais como JSON (JavaScript Object Notation), XML e padrões de imagem (JPEG, GIF, PNG) são definidos aqui. A Camada 6 informa à Camada de Aplicação que "isto é um vídeo" ou "isto é um texto formatado", permitindo que o software renderize os dados corretamente.',
        questions: [
          {
            id: 'q6_4',
            type: 'fill-blank',
            question: 'Qual formato de intercâmbio de dados leve e legível por humanos é comum na Camada 6?',
            answer: 'JSON',
            hint: 'J...',
          }
        ]
      },
      {
        id: 'l6_5',
        title: 'Codificação de Caracteres',
        theory: 'Além das traduções, a Camada 6 gerencia esquemas de codificação como Unicode e ASCII. Se você envia um e-mail com acentos (ex: "Ação"), a Camada de Apresentação garante que o destinatário veja o caractere correto em vez de símbolos quebrados.',
        questions: [
          {
            id: 'q6_5',
            type: 'multiple-choice',
            question: 'Qual desses é um sistema de codificação de caracteres gerenciado na Camada 6?',
            options: ['ASCII', 'TCP', 'UDP', 'IP'],
            answer: 'ASCII',
            hint: 'American Standard Code for Information Interchange.',
          }
        ]
      },
      {
        id: 'l6_challenge',
        title: 'Certificação: Especialista L6',
        theory: 'O exame de tradução e criptografia. Prove que seus dados estão sempre legíveis e protegidos.',
        isChallenge: true,
        questions: [
           { id: 'c6_1', type: 'multiple-choice', question: 'Qual o sucessor moderno e mais seguro do SSL?', options: ['TLS', 'HTTP', 'IPsec', 'ASCII'], answer: 'TLS', hint: 'Transport Layer Security.' },
           { id: 'c6_2', type: 'multiple-choice', question: 'O ato de transformar dados em uma forma ilegível sem uma chave é:', options: ['Compressão', 'Criptografia', 'Tradução', 'Roteamento'], answer: 'Criptografia', hint: 'Base da segurança.' },
           { id: 'c6_3', type: 'fill-blank', question: 'Formato de imagem comum na L6 que usa compressão com perda:', answer: 'JPEG', hint: 'J...' },
           { id: 'c6_4', type: 'multiple-choice', question: 'Diferentes ordenações de bytes (Big-Endian vs Little-Endian) são resolvidas em qual camada?', options: ['Rede', 'Física', 'Apresentação', 'Transporte'], answer: 'Apresentação', hint: 'Tradução de sintaxe de dados.' },
           { id: 'c6_5', type: 'multiple-choice', question: 'Qual destas extensões de arquivo representa compressão de dados na L6?', options: ['.txt', '.zip', '.html', '.css'], answer: '.zip', hint: 'Compactação.' },
           { id: 'c6_6', type: 'multiple-choice', question: 'A Camada 6 lida com a Semântica (Significado) ou a Sintaxe (Forma) dos dados?', options: ['Semântica', 'Sintaxe', 'Ambos', 'Nenhum'], answer: 'Sintaxe', hint: 'Ela cuida de como os dados são formatados.' },
           { id: 'c6_7', type: 'multiple-choice', question: 'MIME (Multipurpose Internet Mail Extensions) opera em qual camada?', options: ['Sessão', 'Apresentação', 'Rede', 'Física'], answer: 'Apresentação', hint: 'Identifica tipos de arquivos em e-mails.' },
           { id: 'c6_8', type: 'multiple-choice', question: 'O que a Camada 6 faz se o app enviar um formato proprietário que ela não conhece?', options: ['Tenta traduzir ou reporta erro', 'Muda o IP', 'Desliga a rede', 'Envia via UDP'], answer: 'Tenta traduzir ou reporta erro', hint: 'Ela é o negociador de sintaxe.' },
           { id: 'c6_9', type: 'fill-blank', question: 'Linguagem de marcação de dados comum na L6 que usa tags:', answer: 'XML', hint: 'X...' },
           { id: 'c6_10', type: 'multiple-choice', question: 'A Camada 6 é frequentemente referida como a camada de...', options: ['Serviço', 'Sintaxe', 'Segmento', 'Sinal'], answer: 'Sintaxe', hint: 'Pela sua função de formatação.' }
        ]
      }
    ]
  },
  {
    id: 'm7',
    title: 'Camada 7: Aplicação',
    lessons: [
      {
        id: 'l7_1',
        title: 'Interface e Usuário',
        theory: 'A Camada 7 é a única que interage diretamente com o usuário final. Ela provê serviços de rede para aplicações como seu navegador, cliente de e-mail ou Skype. Quando você digita uma URL, você está disparando uma requisição na Camada de Aplicação.',
        questions: [
          {
            id: 'q7_1',
            type: 'multiple-choice',
            question: 'Qual camada do modelo OSI está mais visualmente próxima do usuário humano?',
            options: ['Física', 'Sessão', 'Aplicação', 'Física'],
            answer: 'Aplicação',
            hint: 'É o "front office" da rede.',
          }
        ]
      },
      {
        id: 'l7_2',
        title: 'HTTP e HTTPS (Web)',
        theory: 'O HTTP (Hypertext Transfer Protocol) é o protocolo base da Web. O HTTPS é a sua versão segura (HTTP sobre TLS). Ele permite a transferência de páginas HTML, imagens e dados entre servidores e clientes. Requisições GET (pedir algo) e POST (enviar algo) são fundamentos desta camada.',
        questions: [
          {
            id: 'q7_2',
            type: 'multiple-choice',
            question: 'Qual protocolo é usado para carregar o conteúdo das suas redes sociais no navegador?',
            options: ['ICMP', 'HTTP/HTTPS', 'ARP', 'STP'],
            answer: 'HTTP/HTTPS',
            hint: 'Pense em "Hypertext Transfer Protocol".',
          }
        ]
      },
      {
        id: 'l7_3',
        title: 'DNS: A Lista Telefônica',
        theory: 'O DNS (Domain Name System) traduz nomes fáceis (ex: google.com) em endereços IP difíceis (ex: 142.250.x.x). Sem o DNS, você teria que memorizar os números de todos os sites que deseja visitar. Por operar na Camada 7, ele permite que aplicações resolvam nomes amigáveis em frações de segundo.',
        questions: [
          {
            id: 'q7_3',
            type: 'multiple-choice',
            question: 'Qual serviço de aplicação é responsável por converter "secroad.net" em um endereço IP?',
            options: ['DNS', 'DHCP', 'FTP', 'SSH'],
            answer: 'DNS',
            hint: 'Domain Name System.',
          }
        ]
      },
      {
        id: 'l7_4',
        title: 'E-mail: SMTP, IMAP e POP3',
        theory: 'Protocolos de E-mail operam na Camada 7: SMTP (Simple Mail Transfer Protocol) é usado para ENVIAR mensagens, enquanto IMAP e POP3 são usados para RECEBER. O IMAP mantém os e-mails no servidor (sincronizado), enquanto o POP3 geralmente os baixa para sua máquina local.',
        questions: [
          {
            id: 'q7_4',
            type: 'multiple-choice',
            question: 'Qual protocolo você configuraria no seu app de e-mail para ENVIAR mensagens para o exterior?',
            options: ['POP3', 'IMAP', 'SMTP', 'FTP'],
            answer: 'SMTP',
            hint: 'Simple Mail Transfer Protocol.',
          }
        ]
      },
      {
        id: 'l7_5',
        title: 'API Security e SSH',
        theory: 'A Camada 7 também inclui gerenciamento remoto seguro (SSH - Secure Shell) e a comunicação entre softwares (APIs). A segurança aqui foca em autenticação, autorização e proteção contra ataques como SQL Injection ou Cross-Site Scripting (XSS), que visam diretamente a lógica da aplicação.',
        questions: [
          {
            id: 'q7_5',
            type: 'multiple-choice',
            question: 'Qual protocolo permite que um administrador gerencie um servidor Linux remotamente com criptografia total?',
            options: ['Telnet', 'SSH', 'HTTP', 'ICMP'],
            answer: 'SSH',
            hint: 'Secure Shell.',
          }
        ]
      },
      {
        id: 'l7_challenge',
        title: 'Certificação: Arquiteto L7',
        theory: 'A prova final. Domine os protocolos que movem a internet moderna e o topo da cadeia OSI.',
        isChallenge: true,
        questions: [
           { id: 'c7_1', type: 'multiple-choice', question: 'Qual a porta padrão do protocolo HTTP (sem segurança)?', options: ['443', '80', '21', '22'], answer: '80', hint: 'Porta clássica web.' },
           { id: 'c7_2', type: 'multiple-choice', question: 'O protocolo FTP serve para quê?', options: ['Ver e-mails', 'Transferir arquivos', 'Resolver nomes', 'Gerenciar IPs'], answer: 'Transferir arquivos', hint: 'File Transfer Protocol.' },
           { id: 'c7_3', type: 'fill-blank', question: 'Sigla para o protocolo que resolve nomes em IPs:', answer: 'DNS', hint: 'D...' },
           { id: 'c7_4', type: 'multiple-choice', question: 'Ataques de XSS e SQLi ocorrem em qual camada do OSI?', options: ['Física', 'Rede', 'Aplicação', 'Sessão'], answer: 'Aplicação', hint: 'Visam a lógica do código.' },
           { id: 'c7_5', type: 'multiple-choice', question: 'Qual a diferença entre HTTP e HTTPS na Camada 7?', options: ['HTTPS é para sites grandes', 'HTTPS usa TLS para criptografia', 'HTTP é mais lento', 'HTTP usa porta 443'], answer: 'HTTPS usa TLS para criptografia', hint: 'S de Seguro.' },
           { id: 'c7_6', type: 'multiple-choice', question: 'O protocolo SNMP (Simple Network Management Protocol) serve para:', options: ['Jogar online', 'Monitorar dispositivos de rede', 'Enviar e-mails', 'Configurar o Wi-Fi'], answer: 'Monitorar dispositivos de rede', hint: 'Gerenciamento de rede.' },
           { id: 'c7_7', type: 'multiple-choice', question: 'DHCP opera na camada 7, mas provê dados para configurar a camada...', options: ['2', '3', '4', '6'], answer: '3', hint: 'Configura o IP.' },
           { id: 'c7_8', type: 'multiple-choice', question: 'Um WAF (Web Application Firewall) atua protegendo qual camada?', options: ['Camada 1', 'Camada 3', 'Camada 7', 'Camada 4'], answer: 'Camada 7', hint: 'Foca em tráfego HTTP/S.' },
           { id: 'c7_9', type: 'fill-blank', question: 'Protocolo para baixar e-mails mantendo-os no servidor:', answer: 'IMAP', hint: 'I...' },
           { id: 'c7_10', type: 'multiple-choice', question: 'Por que o Telnet é considerado inseguro na Camada 7?', options: ['Porque é lento', 'Porque envia dados e senhas em texto puro (Cleartext)', 'Porque não funciona no Windows', 'Porque usa o protocolo IP'], answer: 'Porque envia dados e senhas em texto puro (Cleartext)', hint: 'Sem segurança ou criptografia.' }
        ]
      }
    ]
  }
];
