"use client";

import Image from "next/image";

export function NosotrosPage() {
  return (
    <div className="bg-white min-h-screen font-sans w-full py-16">
      <div className="max-w-[1920px] mx-auto">
        <div className="max-w-4xl mx-auto px-4 text-[#333333] leading-relaxed text-[15px] space-y-6">
          <h1 className="text-3xl md:text-5xl font-black uppercase mb-12 text-center text-black border-b-2 border-black pb-4 inline-block mx-auto">
            Sobre Nosotros
          </h1>
          <p>
            Allá por el año 2012, surge una semillita mágica dentro de la tienda Robotskate Shop, ya que además de andar en skate, estos lolos jugaban a los cartones mágicos y después de un breve paso por Hualpen, Robot llega a calle Lautaro en Concepción y se genera una pequeña comunidad cartonera, torneos, cartas foil, buenos tiempos.
          </p>
          <p>
            A esa pequeña sección dedicada al Magic se le llamó Calabozo del Robot en honor a Bender de Futurama. La tienda era pequeña, pero acogedora. Después de un tiempo se produce un quiebre entre Julio y Checho, los responsables del Calabozo de ese entonces y el proyecto se acaba momentáneamente.
          </p>
          <p>
            Ante esa situación de quedar sin nuestra “casa” predilecta, se genera una nueva asociación, ahora entre Checho y Alex, quienes toman las riendas y a pesar de no contar con un lugar físico, logran realizar algunos Prelanzamientos en salas de eventos.
          </p>
          <p>
            Así pasó algo de tiempo y se genera un nuevo cambio en la alineación. Sale Checho y vuelve Julio, y en dupla con Alex el proyecto cobra fuerzas. Avanza el 2014 y la noticia de la vuelta de Mitos y Leyendas empieza a correr -una oportunidad imperdible- y es gracias a esto que Calabozo del Robot vuelve a tener lugar físico. Nos instalamos en Orompello 555, y durante un mes y entre amigos se adecúa la tienda: Patinetas, Magia y Mitos todo en uno. La tienda queda hermosa y el éxito lo dice todo, la tienda se llena todos los días, todo marcha bien hasta que llega esa noche... en la madrugada entran a robar, la tienda queda casi desvalijada, un golpe anímico total. Sin embargo, la pega estaba hecha, así que decidimos continuar. Esta no era la primera situación difícil por la que pasaríamos, así que nos pusimos de pie y así transcurrió el año y llegó el 2015, hacia una nueva transición.
          </p>
          <p>
            En febrero de ese año nos cambiamos a Freire y se genera el cambio definitivo: ahora solo con Alex la tienda pasa a llamarse El Calabozo.
          </p>
          <p>
            ¿Qué les puedo contar desde entonces?, la tienda se ha mantenido, tocó competir con tiendas 2 o 3 veces más grandes que la nuestra y seguimos aquí, y creo que ha sido por hacer las cosas lo mejor que hemos podido, con honestidad y esfuerzo, siempre reinventándonos y generando comunidades donde a veces no las había, creando nuevos formatos de juego y por sobre todo, contagiando a otros de nuestro entusiasmo por las cartas, el arte, las historias y la imaginería.
          </p>
          <p>
            Creo en el propósito del juego, que es divertirse. Competir también está bien, nos pone a prueba, pero al menos para mí, siempre lo principal ha sido divertirse, distraerse, echar a volar la imaginación.
          </p>
          <p>
            Pasamos por lo difícil de la pandemia y el 2022 llegó con el cambio más grande hasta ahora: nos mudamos a O'Higgins 950b, frente a Tribunales, nuestra dirección más céntrica (y la más céntrica de todas las tiendas del rubro) y aquí seguimos, ya con 10 años de existencia y con energía para muchos años más de entregar entretención a nuestra ciudad.
          </p>

          <div className="w-full max-w-lg mx-auto pt-10">
            <Image 
              src="/calabozo/nosotros.png" 
              alt="Sobre Nosotros Calabozo" 
              width={800} 
              height={400} 
              className="w-full h-auto object-contain flex justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
