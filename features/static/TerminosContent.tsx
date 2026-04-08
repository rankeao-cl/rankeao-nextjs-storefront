"use client";

import { useTenant } from "@/context/TenantContext";

export default function TerminosContent() {
  const tenant = useTenant();

  return (
    <div className="store-container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="section-title mb-6">Terminos de Uso</h1>

        {tenant.config?.terms_html ? (
          <div className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: tenant.config.terms_html }}
          />
        ) : (
          <div className="space-y-6 text-foreground/80 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">1. Condiciones generales</h2>
              <p>Al acceder y utilizar este sitio web, aceptas cumplir con estos terminos y condiciones de uso. {tenant.name} se reserva el derecho de modificar estos terminos en cualquier momento.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">2. Productos y precios</h2>
              <p>Los precios de los productos estan expresados en pesos chilenos (CLP) e incluyen IVA. {tenant.name} se reserva el derecho de modificar precios sin previo aviso. Los productos estan sujetos a disponibilidad de stock.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">3. Compras y pagos</h2>
              <p>Para realizar una compra debes crear una cuenta y proporcionar informacion veraz. Los metodos de pago aceptados se indican durante el proceso de checkout.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">4. Envios y retiros</h2>
              <p>Ofrecemos retiro en tienda y envio a domicilio. Los tiempos de entrega dependen del metodo seleccionado y la ubicacion del destinatario.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">5. Cambios y devoluciones</h2>
              <p>Aceptamos cambios y devoluciones segun la legislacion vigente. El producto debe estar en las mismas condiciones en que fue recibido.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">6. Contacto</h2>
              <p>Para consultas sobre estos terminos, contactanos a traves de los canales indicados en la seccion de contacto.</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
