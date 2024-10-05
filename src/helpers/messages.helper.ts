const ValidationMessages = {
  portfolio: {
    heroSection: {
      profilePic: {
        'string.base': 'Profile picture must be a string.',
        'string.min': 'Too short profile picture url.',
        'string.max': 'Too large profile picture url.',
      },
      description: {
        'string.base': 'Description must be a string.',
        'any.required': 'Description is required',
        'string.min': 'Too short description.',
        'string.max': 'Too large description.',
      },
    },
    projectSection: {
      name: {
        'string.base': 'Project name should be a string.',
        'string.min': 'Too short project name.',
        'string.max': 'Too large project name.',
        'string.pattern.base': 'Invalid project name.',
      },
      tech_stack: {
        'string.base': 'Tech stack should be a string.',
        'string.min': 'Too short tech stack.',
        'string.max': 'Too large tech stack.',
        'any.requried': 'Tech stack is required',
      },
      live_link: {
        'string.base': 'Live link should be a string.',
        'string.min': 'Too short live link.',
        'string.max': 'Too large live link.',
      },
      documentation_link: {
        'string.base': 'Documentation link should be a string.',
        'string.min': 'Too short documentation link.',
        'string.max': 'Too large documentation link.',
      },
      code_link: {
        'string.base': 'Code link should be a string.',
        'string.min': 'Too short code link.',
        'string.max': 'Too large code link.',
        'any.required': 'Code link is required',
      },
      project_type: {
        'string.base': 'Project type should be a string.',
        'string.min': 'Too short Project type.',
        'string.max': 'Too large Project type.',
        'any.required': 'Project type is required.',
      },
      disabled: {
        'bool.base': 'Invalid project status type.',
        'any.required': 'Project status is required.',
      },
    },
  },
  commons: {
    description: {
      'string.base': 'Description must be a string.',
      'any.required': 'Description is required',
      'string.min': 'Too short description.',
      'string.max': 'Too large description.',
    },
  },
  types: {
    array: {
      'array.base': 'Tech stack must be an array!',
      'array.min': 'Too short tech stack',
      'array.max': 'Too large tech stack',
      'any.required': 'Tech stack are required',
    },
  },
};

export { ValidationMessages };
