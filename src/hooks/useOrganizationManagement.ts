import { useState, useEffect } from 'react';
import { Organization, SocialEvent, PriorityLevel, InterventionType, EventStatus } from '../types/organization';

export const useOrganizationManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('stare_org_management_orgs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'org-1',
        nombre: 'Comedor Popular Oasis de Amor - Catacaos',
        direccion: 'Calle San Francisco Mz C Lote 12 - Bajo Piura',
        sector_demografico: 'Comedor Popular / Madres de Familia',
        deficiencias_infraestructura: ['Sin Agua Potable', 'Sin Techo Sombreador (Altas Temperaturas PIURA)', 'Sin almacén refrigerado'],
        nivel_prioridad: 'alta' as const,
        distrito: 'Catacaos'
      },
      {
        id: 'org-2',
        nombre: 'I.E. Inicial N° 402 Caserío Carrizalillo',
        direccion: 'Kilómetro 45 Carretera Tambogrande',
        sector_demografico: 'Infancia Rural de Extrema Pobreza',
        deficiencias_infraestructura: ['Aulas de caña/madera', 'Sin conexión de red de agua', 'Riesgo de inundación Pluvial'],
        nivel_prioridad: 'alta' as const,
        distrito: 'Tambogrande'
      },
      {
        id: 'org-3',
        nombre: 'Vaso de Leche Capilla de la Virgen - Castilla',
        direccion: 'Asentamiento Humano El Indio Sector B',
        sector_demografico: 'Madres Lactantes y Niñez Temprana',
        deficiencias_infraestructura: ['Utensilios oxidados', 'Falta tanque elevado de agua'],
        nivel_prioridad: 'media' as const,
        distrito: 'Castilla'
      }
    ];
  });

  const [orgEvents, setOrgEvents] = useState<SocialEvent[]>(() => {
    const saved = localStorage.getItem('stare_org_management_events');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ev-org-1',
        organization_id: 'org-1',
        fecha_programada: '2026-07-05',
        tipo_intervencion: 'infraestructura' as const,
        estado: 'pendiente' as const,
        voluntarios_requeridos: 8
      },
      {
        id: 'ev-org-2',
        organization_id: 'org-2',
        fecha_programada: '2026-07-12',
        tipo_intervencion: 'educativa' as const,
        estado: 'pendiente' as const,
        voluntarios_requeridos: 5
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('stare_org_management_orgs', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('stare_org_management_events', JSON.stringify(orgEvents));
  }, [orgEvents]);

  const addOrganization = (org: Omit<Organization, 'id'>) => {
    const newOrg: Organization = {
      ...org,
      id: `org-${Date.now()}`
    };
    setOrganizations(prev => [newOrg, ...prev]);
    return newOrg;
  };

  const addSocialEvent = (event: Omit<SocialEvent, 'id'>) => {
    const newEvent: SocialEvent = {
      ...event,
      id: `ev-${Date.now()}`
    };
    setOrgEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEventStatus = (eventId: string, status: EventStatus) => {
    setOrgEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, estado: status } : ev));
  };

  const deleteOrganization = (orgId: string) => {
    setOrganizations(prev => prev.filter(org => org.id !== orgId));
    setOrgEvents(prev => prev.filter(ev => ev.organization_id !== orgId));
  };

  return {
    organizations,
    orgEvents,
    addOrganization,
    addSocialEvent,
    updateEventStatus,
    deleteOrganization
  };
};
