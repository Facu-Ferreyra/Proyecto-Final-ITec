// Política de privacidad (/privacidad). Pública: la enlazan el pie del inicio,
// el registro y el pie del chat público (ahí los visitantes dejan nombre y teléfono).
//
// Describe lo que la app hace de verdad (ver server/prisma/schema.prisma, la cookie
// de sesión en server/src/middlewares/auth.js y visitorId.js). Si cambia qué datos
// se guardan, hay que actualizar este texto.
//
// Contacto: VITE_CONTACT_EMAIL (en client/.env o en las variables de Render, se lee
// al compilar). Si no está, se ofrece el repositorio del proyecto.

import { Link } from 'react-router-dom'
import './legal.css'

const UPDATED = '17 de noviembre de 2026'
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL
const REPO_URL = 'https://github.com/Facu-Ferreyra/Proyecto-Final-ITec'

function Contact() {
  return CONTACT_EMAIL ? (
    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
  ) : (
    <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
      el repositorio del proyecto
    </a>
  )
}

const SECTIONS = [
  { id: 'quienes-somos', title: 'Quiénes somos' },
  { id: 'que-datos', title: 'Qué datos guardamos' },
  { id: 'para-que', title: 'Para qué los usamos' },
  { id: 'quien-los-ve', title: 'Quién puede verlos' },
  { id: 'cookies', title: 'Cookies y almacenamiento' },
  { id: 'cuanto-tiempo', title: 'Cuánto tiempo los guardamos' },
  { id: 'seguridad', title: 'Seguridad' },
  { id: 'derechos', title: 'Tus derechos' },
  { id: 'cambios', title: 'Cambios y contacto' },
]

export default function PrivacyPage() {
  return (
    <div className="legal">
      {/* React 19 lleva este <title> al <head> mientras la página está abierta. */}
      <title>Política de privacidad · EasyBot</title>

      <header className="legal-bar">
        <Link to="/" className="legal-brand">
          <img src="/favicon.svg" alt="" width="28" height="28" />
          EasyBot
        </Link>
        <Link to="/" className="legal-back">
          Volver al inicio
        </Link>
      </header>

      <main className="legal-main">
        <article className="legal-article">
          <header className="legal-head">
            <p className="legal-eyebrow">Legal</p>
            <h1>Política de privacidad</h1>
            <p className="legal-updated">Última actualización: {UPDATED}</p>
            <p className="legal-lead">
              En pocas palabras: guardamos solo lo necesario para que los bots funcionen, no vendemos datos, no
              mostramos publicidad y no usamos herramientas de seguimiento de terceros.
            </p>
          </header>

          <nav className="legal-toc" aria-label="Contenido">
            <ol>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <section id="quienes-somos">
            <h2>Quiénes somos</h2>
            <p>
              EasyBot es una plataforma para que comercios y emprendimientos creen un chatbot sin programar. Es un
              proyecto académico, desarrollado como Proyecto Integrador Final del programa IntegrarTEC 2026; no es un
              servicio comercial.
            </p>
            <p>En EasyBot hay dos tipos de personas, y guardamos cosas distintas de cada una:</p>
            <ul>
              <li>
                <strong>Dueños de bots:</strong> quienes crean una cuenta para armar el bot de su negocio.
              </li>
              <li>
                <strong>Visitantes:</strong> quienes chatean con un bot publicado desde su link.
              </li>
            </ul>
          </section>

          <section id="que-datos">
            <h2>Qué datos guardamos</h2>
            <h3>Si tenés una cuenta</h3>
            <ul>
              <li>Tu nombre y tu email.</li>
              <li>
                Tu contraseña, pero nunca tal cual la escribiste: se guarda transformada con un algoritmo de un solo
                sentido (bcrypt), así que nadie, ni siquiera nosotros, puede leerla.
              </li>
              <li>
                Los datos de tu negocio que cargás en el asistente (nombre, dirección, horarios, precios, productos,
                formas de pago, etc.). Si publicás el bot, esos datos se vuelven públicos para quien abra el link.
              </li>
            </ul>
            <h3>Si chateás con un bot</h3>
            <ul>
              <li>
                Un identificador anónimo generado al azar y guardado en tu navegador, para agrupar tus mensajes en una
                misma conversación. No contiene tu nombre ni ningún dato tuyo.
              </li>
              <li>Los mensajes de la conversación (tus respuestas y las del bot).</li>
              <li>
                Solo si pedís un turno o hacés un pedido: el nombre y el teléfono que escribas, y los datos del turno o
                del pedido (servicio, fecha y hora, productos, forma de entrega y, si pedís envío, la dirección).
              </li>
            </ul>
            <p>No pedimos ni guardamos documentos, datos de tarjetas ni datos de pago: los pagos no pasan por EasyBot.</p>
          </section>

          <section id="para-que">
            <h2>Para qué los usamos</h2>
            <ul>
              <li>Para que puedas iniciar sesión y administrar tus bots.</li>
              <li>Para que el bot responda y para que el dueño del negocio vea las consultas, turnos y pedidos que recibe.</li>
              <li>Para mantener la plataforma funcionando y segura.</li>
            </ul>
            <p>
              No vendemos ni compartimos datos con fines comerciales, no los usamos para publicidad y no armamos perfiles
              de nadie.
            </p>
          </section>

          <section id="quien-los-ve">
            <h2>Quién puede verlos</h2>
            <ul>
              <li>
                <strong>El dueño del bot</strong> ve, en su panel, las conversaciones y los datos de contacto que se dejaron
                en <em>sus</em> bots. No puede ver los de otros negocios.
              </li>
              <li>
                <strong>El equipo de EasyBot</strong>, con rol de administrador, puede acceder para dar soporte y mantener la
                plataforma.
              </li>
              <li>
                <strong>Los proveedores de infraestructura</strong> que alojan la aplicación (Render) y la base de datos
                (Neon). Sus servidores están en Estados Unidos, así que los datos se transfieren y almacenan fuera de
                Argentina.
              </li>
            </ul>
            <div className="legal-callout">
              <strong>Si sos dueño de un bot:</strong> los datos que tus clientes dejan en el chat son datos de tu negocio.
              Sos responsable de usarlos solo para atender esa consulta, turno o pedido, y de no compartirlos con terceros.
            </div>
          </section>

          <section id="cookies">
            <h2>Cookies y almacenamiento</h2>
            <p>Usamos lo mínimo para que la app funcione. No hay cookies de publicidad, de analítica ni de terceros.</p>
            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th scope="col">Qué</th>
                    <th scope="col">Para qué</th>
                    <th scope="col">Cuánto dura</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cookie de sesión</td>
                    <td>Mantenerte con la sesión iniciada. No se puede leer desde el navegador (es httpOnly).</td>
                    <td>Hasta que cerrás sesión o vence (1 día)</td>
                  </tr>
                  <tr>
                    <td>Identificador del chat (almacenamiento local)</td>
                    <td>Que el dueño vea tus mensajes como una sola conversación.</td>
                    <td>Hasta que borres los datos del navegador</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="cuanto-tiempo">
            <h2>Cuánto tiempo los guardamos</h2>
            <ul>
              <li>Los datos de tu cuenta, mientras la cuenta exista.</li>
              <li>
                Las conversaciones, turnos y pedidos de un bot, mientras el bot exista. Cuando el dueño elimina un bot, se
                borran también todas sus conversaciones y registros.
              </li>
              <li>Si se elimina una cuenta, se borran con ella todos sus bots y lo que estos recibieron.</li>
            </ul>
          </section>

          <section id="seguridad">
            <h2>Seguridad</h2>
            <p>
              La conexión viaja cifrada (HTTPS), las contraseñas se guardan transformadas con bcrypt y cada consulta al
              servidor verifica que solo accedas a tus propios bots. Ningún sistema es 100% seguro, pero si detectamos un
              problema que afecte tus datos, te vamos a avisar.
            </p>
          </section>

          <section id="derechos">
            <h2>Tus derechos</h2>
            <p>
              Según la Ley 25.326 de Protección de Datos Personales, podés pedir en cualquier momento <strong>ver</strong>{' '}
              qué datos tuyos tenemos, <strong>corregirlos</strong> o <strong>borrarlos</strong>. El acceso es gratuito
              (a intervalos de seis meses, salvo que tengas un interés legítimo para pedirlo antes). Escribinos a{' '}
              <Contact /> y te respondemos dentro de los plazos de la ley.
            </p>
            <p>
              Si dejaste tus datos en el chat de un negocio, también podés pedírselo directamente a ese negocio, que es
              quien los usa.
            </p>
            <p className="legal-aaip">
              La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326,
              tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus
              derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.
            </p>
          </section>

          <section id="cambios">
            <h2>Cambios y contacto</h2>
            <p>
              Si cambiamos esta política, vamos a actualizar la fecha de arriba y, si el cambio es importante, avisarles a
              los dueños de cuentas. Para cualquier consulta sobre tus datos, escribinos a <Contact />.
            </p>
          </section>
        </article>
      </main>

      <footer className="legal-footer">
        <p>EasyBot · Proyecto Integrador Final · IntegrarTEC 2026</p>
      </footer>
    </div>
  )
}
