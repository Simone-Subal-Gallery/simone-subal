export default {
  name: 'staff',
  title: 'Staff',
  type: 'object',
  fields: [
    {
      title: 'Name',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Position',
      name: 'position',
      type: 'string'
    },
    {
      name: "email",
      title: "Email address",
      type: "string",
      validation: (Rule) =>
        Rule.regex(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
          {
            name: "email", // Error message is "Does not match email-pattern"
            invert: false, // Boolean to allow any value that does NOT match pattern
          }
        ),
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'position'
    }
  },
}
