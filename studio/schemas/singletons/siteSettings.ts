import { defineArrayMember, defineField, defineType } from 'sanity';
import { requiredTitle } from '../../lib/validation';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Business details that feed the Organization / LocalBusiness JSON-LD on every page. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'businessName', title: 'Business name', type: 'string', validation: requiredTitle }),
    defineField({
      name: 'businessType',
      title: 'Schema type',
      type: 'string',
      initialValue: 'Organization',
      description: 'Use LocalBusiness (or a subtype) only if there is a public storefront or service location.',
      options: {
        list: ['Organization', 'LocalBusiness', 'MedicalBusiness', 'ProfessionalService'],
      },
    }),
    defineField({ name: 'description', title: 'Short description', type: 'text', rows: 3 }),
    defineField({ name: 'logo', title: 'Logo', type: 'imageWithAlt', description: 'Square, at least 112 x 112.' }),
    defineField({ name: 'telephone', title: 'Phone', type: 'string', description: 'International format, e.g. +1-808-555-0100.' }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'email' }) }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({ name: 'street', title: 'Street', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'region', title: 'State / region', type: 'string' }),
        defineField({ name: 'postalCode', title: 'Postal code', type: 'string' }),
        defineField({ name: 'country', title: 'Country', type: 'string', initialValue: 'US' }),
      ],
    }),
    defineField({ name: 'geo', title: 'Map location', type: 'geopoint' }),
    defineField({ name: 'serviceArea', title: 'Service area', type: 'string', description: 'e.g. Hawaiian Islands' }),
    defineField({ name: 'priceRange', title: 'Price range', type: 'string', description: 'LocalBusiness only, e.g. $$.' }),
    defineField({
      name: 'hours',
      title: 'Opening hours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hoursRow',
          fields: [
            defineField({ name: 'days', title: 'Days', type: 'array', of: [{ type: 'string' }], options: { list: DAYS }, validation: (r) => r.required().min(1) }),
            defineField({ name: 'opens', title: 'Opens', type: 'string', description: '24h, e.g. 09:00', validation: (r) => r.required().regex(/^\d{2}:\d{2}$/) }),
            defineField({ name: 'closes', title: 'Closes', type: 'string', description: '24h, e.g. 17:00', validation: (r) => r.required().regex(/^\d{2}:\d{2}$/) }),
          ],
          preview: { select: { days: 'days', opens: 'opens', closes: 'closes' }, prepare: ({ days, opens, closes }) => ({ title: `${(days ?? []).join(', ')}`, subtitle: `${opens}-${closes}` }) },
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social profiles',
      type: 'array',
      of: [defineArrayMember({ type: 'url', validation: (r) => r.uri({ scheme: ['https'] }) })],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
});
