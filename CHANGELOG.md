# clera-ui

## 0.1.0

### Minor Changes

- 09088a8: All notable changes to this project will be documented in this file.

  ## [Unreleased] - 2026-01-13

  ### Pre-Initial Release

  This marks the initial feature-complete release of Clera UI, a comprehensive React component library built with TypeScript, Tailwind CSS, and modern development practices.

  ### **Core Components**

  #### **UI Components**
  - **Alert** - Status messaging component with multiple variants (default, destructive, success, warning) and customizable icons
  - **AlertDialog** - Modal confirmation dialogs for critical actions with proper accessibility
  - **Badge** - Compact status indicators with variant support (default, secondary, destructive, outline)
  - **BrandLogo** - Configurable logo component for consistent brand representation
  - **Button** - Flexible button component with multiple variants (default, destructive, outline, secondary, ghost, link), sizes, loading states, icon support, and asChild pattern for polymorphic rendering
  - **Card** - Composable card container with `Card.Thumbnail` and `Card.Content` slots for flexible layouts
  - **Dialog** - Full-featured modal system built on Radix UI with backdrop, focus management, and proper ARIA
  - **Drawer** - Slide-out panels for navigation and secondary content
  - **DropdownMenu** - Context menus with keyboard navigation and nested submenu support
  - **Skeleton** - Loading state placeholders with animation and configurable shapes
  - **Tooltip** - Hover information displays with proper positioning and accessibility

  #### **Layout Components**
  - **BaseLayout** - Fundamental layout wrapper with consistent spacing and structure
  - **PlainLayout** - Minimal layout container for simple content organization
  - **FabricLayer** - Background texture and pattern system for visual depth

  #### **Form System**

  Comprehensive form ecosystem with validation, accessibility, and developer experience:
  - **Form** - React Hook Form integration with TypeScript support and automatic validation binding
  - **FormItem** - Wrapper component that automatically injects form context (value, errors, validation state) into child components
  - **FormInputWrapper** - Shared wrapper providing floating labels, error states, icons, and consistent styling across all form inputs

  ##### **Input Components**
  - **Input** - Advanced text input with comprehensive validation system:
    - 30+ built-in validation patterns (email, phone, numeric, alphanumeric, URLs, etc.)
    - Real-time validation with configurable modes (onChange, onBlur, combined)
    - Character-by-character input prevention with `preventInvalidInput`
    - Paste event validation ensuring consistent behavior
    - Transform functions for input cleaning and formatting
    - Keyboard shortcut support (Ctrl+A, Ctrl+V, copy operations)
    - Validation presets for common use cases
    - Debounced validation with configurable delay
    - Custom validation rules and error messaging
  - **MaskedInput** - Password input with show/hide functionality and secure character masking

  ##### **Selection Components**
  - **Select** - Native select dropdown optimized for simple option lists (<20 items)
  - **ComboBox** - Advanced searchable dropdown with filtering, built on `cmdk`:
    - Virtual scrolling for large datasets
    - Real-time search and filtering
    - Grouping support with visual separators
    - Keyboard navigation (arrow keys, enter, escape)
    - No results state handling
    - Async data loading support via `AsyncComboBox`
    - Full width alignment with trigger element

  ##### **Control Components**
  - **Checkbox** - Accessible checkbox with indeterminate state support
  - **Radio/RadioGroup** - Radio button groups with keyboard navigation and proper grouping
  - **Switch** - Toggle switches for binary states with smooth animations
  - **Calendar** - Date selection component with keyboard navigation and localization support

  ### **Design System**

  #### **Design Tokens**
  - **Color System** - Comprehensive color palette with light/dark mode support:
    - Semantic color tokens (text, background, border, accent)
    - Brand color integration (lime, red, blue, violet, etc.)
    - Neutral grayscale with 900-level granularity
    - Automatic dark mode variants for all tokens
    - CSS custom properties for runtime theming
  - **Typography Scale** - Responsive typography system:
    - Display styles (2xl, xl, lg, md) for headlines
    - Heading hierarchy (4xl through sm) with responsive scaling
    - Body text (2xl through xs) with optimal reading experience
    - Label styles (xl through xxs) for UI components
    - Helper text styling for errors and descriptions
    - Code formatting with syntax highlighting ready
    - Link styles (default, subtle) with hover states
  - **Spacing System** - Consistent spatial rhythm:
    - Base spacing unit with calc-based scaling
    - Space tokens (xs through 4xl) for margins/padding
    - Gap tokens for layout containers
    - Responsive breakpoint considerations

  #### **Theme Architecture**
  - **Light/Dark Mode** - Automatic theme switching with CSS custom properties
  - **Token Generation** - Automated design token compilation from JSON to CSS
  - **Tailwind Integration** - Seamless integration with utility-first CSS
  - **Runtime Theming** - Dynamic color scheme switching capability

  ### **Development Experience**

  #### **Build System**
  - **Multi-format Bundling** - ES modules, CommonJS, and UMD builds for maximum compatibility
  - **TypeScript** - Full type safety with comprehensive type exports
  - **Tree Shaking** - Optimized bundle sizes with dead code elimination
  - **CSS Bundling** - Compiled styles for easy integration
  - **Package Generation** - Automated package.json creation for distribution

  #### **Development Tools**
  - **Storybook Integration** - Interactive component documentation and development environment
  - **Story Documentation** - Comprehensive MDX documentation for each component with:
    - Usage examples and code snippets
    - Props documentation with ArgTypes
    - Best practices and design guidelines
    - Interactive canvas for component testing
    - Copy-paste ready code examples

  #### **Quality Assurance**
  - **ESLint Configuration** - Comprehensive linting with TypeScript, React, and accessibility rules
  - **Prettier Integration** - Consistent code formatting across the project
  - **Jest Testing** - Unit testing setup with React Testing Library integration
  - **Husky Git Hooks** - Pre-commit validation ensuring code quality
  - **Commitizen** - Conventional commit message format enforcement
  - **TypeScript Strict Mode** - Maximum type safety with strict configuration

  #### **Testing Infrastructure**
  - **Jest Configuration** - ESM support with proper module resolution
  - **React Testing Library** - Component testing utilities with accessibility focus
  - **Coverage Reporting** - Code coverage tracking with configurable thresholds
  - **Mock System** - SVG and CSS mocking for reliable test execution

  ### **Package Management**
  - **PNPM Optimization** - Fast, disk-space efficient package management
  - **Workspace Configuration** - Monorepo-ready structure for future expansion
  - **Dependency Management** - Careful peer dependency management for flexible integration
  - **Bundle Analysis** - Automated bundle size monitoring and optimization

  ### 🔧 **Developer Utilities**
  - **Path Aliases** - Clean imports with @ prefix for internal modules
  - **Utility Functions** - Tailwind CSS class name merging and conditional styling
  - **Component Patterns** - Consistent component architecture with forwardRef and proper TypeScript generics
  - **Accessibility** - ARIA attributes, keyboard navigation, and screen reader support built into all components

  ### **Documentation System**
  - **Storybook Stories** - Interactive component playground with live editing
  - **MDX Documentation** - Rich documentation format combining markdown and interactive examples
  - **API Documentation** - Auto-generated props tables with TypeScript integration
  - **Usage Examples** - Real-world implementation patterns and best practices
  - **Design Guidelines** - Component usage recommendations and accessibility considerations

  ### **Key Features**
  - **Accessibility First** - WCAG 2.1 compliance with proper ARIA implementation
  - **TypeScript Native** - Built with TypeScript from the ground up with comprehensive type exports
  - **Tree Shakeable** - Optimized bundle sizes with selective component importing
  - **Theme System** - Flexible theming with design tokens and CSS custom properties
  - **Developer Experience** - Rich development tools, documentation, and testing infrastructure
  - **Modern Architecture** - Built on React 18+ with modern patterns and performance optimizations
  - **Component Composition** - Flexible component patterns supporting complex UI compositions
  - **Validation System** - Comprehensive form validation with real-time feedback and custom rules
  - **Responsive Design** - Mobile-first responsive behavior across all components
  - **Performance Optimized** - Lazy loading, virtual scrolling, and optimized re-rendering patterns

  ### **Ready for Production**

  This release establishes a solid foundation for building modern React applications with a complete component library, design system, and development infrastructure. All components are production-ready with comprehensive testing, documentation, and accessibility compliance.

  ***

  _This changelog follows [Keep a Changelog](https://keepachangelog.com/) principles and [Semantic Versioning](https://semver.org/)._
