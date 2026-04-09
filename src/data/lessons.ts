export interface Lesson {
  id: string;
  title: string;
  type: 'multiple-choice' | 'fill-blank';
  question: string;
  options?: string[];
  answer: string;
  hint: string;
  theory: string;
  optionHints?: Record<string, string>;
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
        id: 'l1',
        title: 'Cabos de Rede',
        type: 'multiple-choice',
        question: 'Qual cabo é o mais resistente a interferência eletromagnética (EMI)?',
        options: ['Cat5e', 'Cat6', 'Fibra Óptica', 'Coaxial'],
        answer: 'Fibra Óptica',
        hint: 'Sinais de luz não são afetados por eletricidade.',
        theory: 'A Camada Física trata dos meios de transmissão. Cabos de par trançado (UTP) usam conectores RJ45 e são a base das redes locais. Cabos de par trançado são vulneráveis a interferência, enquanto a fibra óptica usa luz para transmitir dados, sendo imune a ruídos elétricos.',
        optionHints: {
          'Cat5e': 'Cabo de par trançado comum, suporta 1Gbps, muito sensível a ruído.',
          'Cat6': 'Melhor blindagem que o Cat5e, mas ainda é de cobre e sofre interferência.',
          'Fibra Óptica': 'Utiliza pulsos de luz em vez de eletricidade, sendo imune a EMI.',
          'Coaxial': 'Cabo antigo com um condutor central, usado em TV a cabo, difícil de manusear.'
        }
      },
      {
        id: 'l2',
        title: 'Engenharia Social',
        type: 'multiple-choice',
        question: 'Qual é o método mais comum para hackers "burlarem" a segurança física?',
        options: ['Tailgating (Caronagem)', 'Lockpicking', 'Cortar Dutos', 'Social Stealth'],
        answer: 'Tailgating (Caronagem)',
        hint: 'Seguir alguém por uma porta segura sem usar credencial.',
        theory: 'Segurança física é a primeira barreira. Tailgating (ou caronagem) acontece quando um atacante entra em um local restrito seguindo um usuário autorizado. Isso explora a cortesia humana e a falta de vigilância.',
        optionHints: {
          'Tailgating (Caronagem)': 'Explora a educação das pessoas para entrar em locais restritos.',
          'Lockpicking': 'A arte de abrir fechaduras sem a chave, exige perícia técnica física.',
          'Cortar Dutos': 'Método hollywoodiano, raro na vida real devido a sensores de pressão.',
          'Social Stealth': 'Camuflar-se no ambiente agindo como se pertencesse ao local.'
        }
      },
    ],
  },
  {
    id: 'm2',
    title: 'Camada 2: Link de Dados',
    lessons: [
      {
        id: 'l3',
        title: 'Endereços MAC',
        type: 'fill-blank',
        question: 'Qual comando no Linux mostra suas interfaces de rede e endereços MAC?',
        answer: 'ifconfig',
        hint: 'Ou seu substituto mais novo "ip addr".',
        theory: 'A Camada 2 usa o endereço MAC (Media Access Control) para identificar dispositivos fisicamente conectados. Cada dispositivo de rede possui um endereço MAC único gravado pelo fabricante.',
      },
    ],
  },
  {
    id: 'm3',
    title: 'O Terminal',
    lessons: [
      {
        id: 'l4',
        title: 'Navegação em Diretórios',
        type: 'fill-blank',
        question: 'Qual comando é usado para listar arquivos em um diretório?',
        answer: 'ls',
        hint: 'Duas letras, abreviação de "list".',
        theory: 'O terminal é a ferramenta fundamental de segurança. O comando "ls" permite visualizar o conteúdo da pasta atual, revelando arquivos ocultos e permissões vitais.',
      },
    ],
  },
  {
    id: 'm4',
    title: 'Camada 4: Transporte',
    lessons: [
      {
        id: 'l5',
        title: 'TCP vs UDP',
        type: 'multiple-choice',
        question: 'Qual protocolo garante a entrega dos dados através do "Three-way Handshake"?',
        options: ['TCP', 'UDP', 'IP', 'ICMP'],
        answer: 'TCP',
        hint: 'TCP foca em confiabilidade, UDP em velocidade.',
        theory: 'A Camada de Transporte é responsável pela comunicação fim-a-fim. O protocolo TCP garante que os dados cheguem íntegros e na ordem correta através do Three-way Handshake (SYN, SYN-ACK, ACK). Já o UDP é "connectionless", priorizando a velocidade para streaming e jogos, sem garantia de entrega.',
        optionHints: {
          'TCP': 'Transmission Control Protocol. Focado em confiabilidade e entrega garantida.',
          'UDP': 'User Datagram Protocol. Rápido, mas não garante que os dados cheguem.',
          'IP': 'Protocolo de Redirecionamento (Camada 3), não lida com o Handshake.',
          'ICMP': 'Usado para mensagens de erro e ping, não é focado no transporte de dados.'
        }
      },
      {
        id: 'l6',
        title: 'Portas de Serviço',
        type: 'fill-blank',
        question: 'Em qual porta padrão o serviço SSH (Secure Shell) escuta por conexões?',
        answer: '22',
        hint: 'É uma das portas "bem conhecidas" (well-known ports) abaixo de 1024.',
        theory: 'Portas lógicas permitem que múltiplos serviços funcionem no mesmo IP. Cada serviço escuta em uma porta padrão: SSH (22), HTTP (80), HTTPS (443), FTP (21). Conhecer as portas é vital para análise de rede e firewalls.',
      },
    ],
  },
  {
    id: 'm5',
    title: 'Camada 7: Aplicação',
    lessons: [
      {
        id: 'l7',
        title: 'Protocolo HTTP/HTTPS',
        type: 'multiple-choice',
        question: 'Qual é a principal diferença entre HTTP e HTTPS?',
        options: ['Velocidade', 'Criptografia', 'Porta 80', 'Nenhuma'],
        answer: 'Criptografia',
        hint: 'HTTPS usa SSL/TLS para proteger os dados.',
        theory: 'A Camada de Aplicação é onde o usuário interage. O HTTP (porta 80) envia dados em texto claro, vulnerável a interceptação. O HTTPS (porta 443) utiliza certificados SSL/TLS para criptografar a comunicação, garantindo privacidade e autenticidade.',
        optionHints: {
          'Velocidade': 'HTTPS é ligeiramente mais lento devido ao handshake de criptografia.',
          'Criptografia': 'A chave do HTTPS é o uso de SSL/TLS para proteger o tráfego.',
          'Porta 80': 'Esta é a porta padrão do HTTP inseguro.',
          'Nenhuma': 'Existem diferenças críticas de segurança entre os dois.'
        }
      },
      {
        id: 'l8',
        title: 'DNS (O catálogo da rede)',
        type: 'fill-blank',
        question: 'Qual é o nome do sistema que traduz nomes de domínio (google.com) em endereços IP?',
        answer: 'DNS',
        hint: 'A sigla para Domain Name System.',
        theory: 'O DNS resolve nomes legíveis por humanos em endereços IP. Sem ele, você teria que decorar o IP de cada site.\n\n[ FLUXO_DNS ]\nUSUÁRIO -> "google.com" -> DNS RESOLVER\nDNS RESOLVER -> "8.8.8.8" -> USUÁRIO\nCONEXÃO ESTABELECIDA!',
      },
    ],
  },
];
