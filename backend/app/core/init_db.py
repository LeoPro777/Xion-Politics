from datetime import date
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base
from app.models.estructura import CargoEstructura, CentroVotacion, Municipio, Parroquia
from app.models.lead import Lead
from app.models.militante import Militante
from app.models.user import User


async def init_db_seeds(session: AsyncSession) -> None:
    # 1. Verificar si existen municipios
    mun_count = (await session.execute(select(func.count(Municipio.id)))).scalar_one() or 0
    if mun_count == 0:
        municipios_seed = [
            ("Maracaibo", "Metropolitana"),
            ("San Francisco", "Metropolitana"),
            ("Cabimas", "COL"),
            ("Lagunillas", "COL"),
            ("Machiques de Perijá", "Perijá"),
            ("Colón", "Sur del Lago"),
            ("Santa Rita", "COL"),
            ("Mara", "Guajira"),
            ("Baralt", "COL"),
            ("Valmore Rodríguez", "COL"),
            ("Miranda", "COL"),
            ("Simón Bolívar", "COL"),
            ("Rosario de Perijá", "Perijá"),
            ("Jesús Enrique Lossada", "Metropolitana"),
            ("La Cañada de Urdaneta", "Metropolitana"),
            ("Guajira", "Guajira"),
            ("Catatumbo", "Sur del Lago"),
            ("Francisco Javier Pulgar", "Sur del Lago"),
            ("Sucre", "Sur del Lago"),
            ("Jesús María Semprúm", "Sur del Lago"),
            ("Almirante Padilla", "Metropolitana"),
        ]
        created_municipios = []
        for nombre, subregion in municipios_seed:
            m = Municipio(nombre=nombre, subregion=subregion)
            session.add(m)
            created_municipios.append(m)
        await session.flush()

        # Crear parroquias base para Maracaibo y San Francisco
        parroquias_data = [
            (created_municipios[0].id, "Chiquinquirá"),
            (created_municipios[0].id, "Olegario Villalobos"),
            (created_municipios[0].id, "Santa Lucía"),
            (created_municipios[0].id, "Juana de Ávila"),
            (created_municipios[1].id, "San Francisco"),
            (created_municipios[1].id, "El Bajo"),
            (created_municipios[1].id, "Domitila Flores"),
            (created_municipios[2].id, "Carmen Herrera"),
            (created_municipios[3].id, "Alonso de Ojeda"),
        ]
        created_parroquias = []
        for m_id, p_nom in parroquias_data:
            p = Parroquia(municipio_id=m_id, nombre=p_nom)
            session.add(p)
            created_parroquias.append(p)
        await session.flush()

        # Crear centros de votación muestra
        cv1 = CentroVotacion(
            parroquia_id=created_parroquias[0].id,
            codigo_cne="CV-ZUL-001",
            nombre="Liceo Rafael María Baralt",
            direccion="Av. El Milagro, Maracaibo",
            mesas_electorales=4,
            votantes_esperados=2400,
        )
        cv2 = CentroVotacion(
            parroquia_id=created_parroquias[4].id,
            codigo_cne="CV-ZUL-002",
            nombre="U.E. Mathias Lossada",
            direccion="Urb. La Coromoto, San Francisco",
            mesas_electorales=3,
            votantes_esperados=1850,
        )
        session.add_all([cv1, cv2])

    # 2. Verificar Cargos Estatutarios
    cargos_count = (await session.execute(select(func.count(CargoEstructura.id)))).scalar_one() or 0
    if cargos_count == 0:
        cargos_municipales = [
            "Coordinador Juvenil Municipal",
            "Coordinador Adjunto Juvenil Municipal",
            "Coordinador de Asuntos Políticos",
            "Coordinador de Organización",
            "Coordinador de Formación",
            "Coordinador de Comunicación",
            "Coordinador de Asuntos Universitarios",
            "Coordinador de Activismo",
            "Coordinador Electoral",
            "Coordinador de Asuntos Sociales",
            "Coordinador de DDHH",
            "Coordinador de Ambiente y Desarrollo",
            "Coordinador Político I",
        ]
        for idx, cargo in enumerate(cargos_municipales, start=1):
            session.add(
                CargoEstructura(
                    nivel="MUNICIPAL", nombre_cargo=cargo, orden_jerarquico=idx
                )
            )

        cargos_parroquiales = [
            "Coordinador Juvenil Parroquial",
            "Coordinador Adjunto Juvenil Parroquial",
            "Coordinador de Asuntos Políticos",
            "Coordinador de Organización",
            "Coordinador de Formación",
            "Coordinador de Comunicación",
            "Coordinador de Activismo",
            "Coordinador Electoral",
            "Coordinador Político I",
        ]
        for idx, cargo in enumerate(cargos_parroquiales, start=1):
            session.add(
                CargoEstructura(
                    nivel="PARROQUIAL", nombre_cargo=cargo, orden_jerarquico=idx
                )
            )

    # 3. Verificar Usuario Superadmin Semilla
    admin_stmt = select(User).where(User.email == "admin@pjzulia.org.ve")
    existing_admin = (await session.execute(admin_stmt)).scalar_one_or_none()
    if not existing_admin:
        admin_user = User(
            email="admin@pjzulia.org.ve",
            full_name="Leonard Hernández (Coordinación Regional)",
            role="SUPERADMIN",
            is_active=True,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        )
        session.add(admin_user)

    # Usuarios muestra para evaluación territorial (Líder Municipal y Líder Parroquial)
    m_user_stmt = select(User).where(User.email == "municipal@pjzulia.org.ve")
    if not (await session.execute(m_user_stmt)).scalar_one_or_none():
        m_user = User(
            email="municipal@pjzulia.org.ve",
            full_name="Andrés Parra (Coordinador Maracaibo)",
            role="MUNICIPAL_LEADER",
            municipio_id=1,
            is_active=True,
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        )
        session.add(m_user)

    p_user_stmt = select(User).where(User.email == "parroquial@pjzulia.org.ve")
    if not (await session.execute(p_user_stmt)).scalar_one_or_none():
        p_user = User(
            email="parroquial@pjzulia.org.ve",
            full_name="Beatriz Rivas (Coordinadora Chiquinquirá)",
            role="PARROQUIAL_LEADER",
            municipio_id=1,
            parroquia_id=1,
            is_active=True,
            avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        )
        session.add(p_user)

    # 4. Datos de demostración de Militantes y Leads si está vacío
    militantes_count = (await session.execute(select(func.count(Militante.id)))).scalar_one() or 0
    if militantes_count == 0:
        p_first = (await session.execute(select(Parroquia))).scalars().first()
        cv_first = (await session.execute(select(CentroVotacion))).scalars().first()
        if p_first:
            m1 = Militante(
                nacionalidad="V",
                cedula=27891234,
                primer_nombre="José",
                primer_apellido="González",
                fecha_nacimiento=date(2002, 5, 14),
                telefono="+584146123456",
                email="jose.gonzalez@pjzulia.org.ve",
                ocupacion="Estudiante de Derecho",
                es_estudiante=True,
                universidad="LUZ",
                parroquia_id=p_first.id,
                centro_votacion_id=cv_first.id if cv_first else None,
                rol_electoral="COORDINADOR_CENTRO",
                activo=True,
            )
            m2 = Militante(
                nacionalidad="V",
                cedula=28904561,
                primer_nombre="Mariana",
                primer_apellido="Paredes",
                fecha_nacimiento=date(2003, 9, 21),
                telefono="+584246987123",
                email="mariana.paredes@pjzulia.org.ve",
                ocupacion="Comunicación Social",
                es_estudiante=True,
                universidad="URBE",
                parroquia_id=p_first.id,
                centro_votacion_id=cv_first.id if cv_first else None,
                rol_electoral="TESTIGO",
                activo=True,
            )
            session.add_all([m1, m2])

    leads_count = (await session.execute(select(func.count(Lead.id)))).scalar_one() or 0
    if leads_count == 0:
        l1 = Lead(
            tipo="VOLUNTARIADO_GENERAL",
            nombre_completo="Carlos Eduardo Rincón",
            edad=21,
            telefono="+584126549870",
            email="carlos.rincon@gmail.com",
            municipio_texto="Maracaibo",
            area_interes="Defensa Electoral",
            mensaje="Deseo ser testigo de mesa en mi comunidad.",
            estado="NUEVO",
        )
        l2 = Lead(
            tipo="FORMACION_POLITICA",
            nombre_completo="Valeria Sofía Urdaneta",
            edad=19,
            telefono="+584146001122",
            email="valeria.urdaneta@gmail.com",
            municipio_texto="San Francisco",
            area_interes="Formación Política y Liderazgo",
            mensaje="Quiero inscribirme en la Escuela de Líderes.",
            estado="CONTACTADO",
        )
        session.add_all([l1, l2])

    await session.commit()


if __name__ == "__main__":
    import asyncio
    from app.core.database import AsyncSessionLocal, engine

    async def main():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        async with AsyncSessionLocal() as session:
            await init_db_seeds(session)
        print("Initial database tables and seeds created successfully!")

    asyncio.run(main())
