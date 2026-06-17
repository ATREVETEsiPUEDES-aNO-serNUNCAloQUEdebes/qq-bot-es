import { Plugin, Context } from 'zhin';
import { answerQuestionSearchWiki } from './buildAnswer';

export const name = 'tw-qa';

const wikis = [
  {
    command: 'cn',
    name: 'Tutorial chino',
    WIKI_HOST: 'localhost',
    WIKI_PORT: 5213,
    website: 'https://tw-cn.cpolar.top/',
    // nodejs wiki, can use single tiddler view
    hashPrefix: true,
  },
  {
    command: 'doc',
    name: 'Documentos oficiales',
    WIKI_HOST: 'localhost',
    WIKI_PORT: 5215,
    website: 'https://tw-cn-doc.cpolar.top/',
    hashPrefix: false,
  },
  {
    command: 'tidgi',
    name: 'Sitio web oficial de Taiji',
    WIKI_HOST: 'localhost',
    WIKI_PORT: 5216,
    website: 'https://tidgi.fun/',
    hashPrefix: true,
  },
  {
    command: 'onetwo',
    name: 'El blog de Lin Yier',
    WIKI_HOST: 'localhost',
    WIKI_PORT: 5217,
    website: 'https://wiki.onetwo.ren/',
    hashPrefix: false,
  },
  {
    command: 'cpl',
    name: 'Fuente de complemento chino',
    WIKI_HOST: 'localhost',
    WIKI_PORT: 5218,
    website: 'https://tw-cpl.cpolar.top/',
    hashPrefix: true,
  },
  {
    command: 'memo',
    name: 'Articulos en chino sobre teorias del aprendizaje.',
    WIKI_HOST: 'localhost',
    WIKI_PORT: 5219,
    website: 'https://dongrentianyu.github.io/memo/',
    hashPrefix: true,
  },
];
const padNameLength = [...wikis].sort((a, b) => b.name.length - a.name.length)[0].name.length;

export function install(this: Plugin, ctx: Context) {
  // Implemente la logica de su complemento aqui
  // Ejemplos de funciones：
  //1.Definir instrucciones

  wikis.forEach((wiki) => {
    const { command, name, WIKI_HOST, WIKI_PORT } = wiki;
    ctx
      .command(`${command} <keyword:string>`)
      .option('-c [count:number]')
      .option('-p [pagination:number]')
      .sugar(name)
      .action(async ({ session, options }, query) => {
        const queryString = query;

        const WIKI_URL = `${WIKI_HOST}:${WIKI_PORT}`;

        const result = answerQuestionSearchWiki({ WIKI_URL, query: queryString, command, name, ...wiki }, options);
        return result;
      });
  });

  ctx
    .command(`usage`)
    .sugar('Uso de robots')
    .action(async ({ session, options }, query) => {
      const result = `Base de conocimientos disponible：

| ${'Nombre'.padEnd(padNameLength, '　')} | ${'Instrucciones'}
${wikis.map((wiki) => `| ${wiki.name.padEnd(padNameLength, '　')} | ${wiki.command}`).join('\n')}

Como usarlo, como enviar en el cuadro de chat. \`${wikis[0].command} Sincronizacion\` Tu puedes${wikis[0].name}Busque en la base de conocimientos contenido relacionado con la sincronizacion.
`;
      return result;
    });

  // 2.Definir middleware
  /*
    ctx.middleware(async (event,next)=>{
        if(true){ //Condiciones que requieren juicio
        //Codigo de ejecucion logica
        }else{
            next() // Nonext，No pasara al siguiente middleware
        }
    });
    */
  // 3. Escuchar eventos
  /*
    ctx.on(eventName,callback);
    ctx.once(eventName,callback);
    ctx.on(eventName,callback);
    */
  // 4. Definir servicios
  /*
    ctx.service('serviceName'，{}) // Ir abotAgregue propiedades accesibles globalmente
    */
  // 5. Agregue efectos secundarios de complementos personalizados(Codigo que debe ejecutarse cuando se desinstala el complemento)
  // Si no lo necesitas, no es necesarioreturn
  /*
    return ()=>{
        // Si has usadoreactdeuseEffect Entonces deberias saber que esta haciendo esto.
        // El contenido de la funcion se desinstalara automaticamente cuando se desinstale el complemento.
    }
    */
}
