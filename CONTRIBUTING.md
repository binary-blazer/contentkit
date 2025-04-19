# Contributing to ContentKit

Thank you for your interest in contributing to ContentKit! We welcome contributions of all kinds, including bug fixes, feature requests, documentation improvements, and more.

## Getting Started

1. **Fork the Repository**: Start by forking the repository to your GitHub account.

2. **Clone the Repository**: Clone your forked repository to your local machine:

   ```bash
   git clone https://github.com/contentkitjs/contentkit.git
   cd contentkit
   ```

3. **Install Dependencies**: Install the required dependencies using `pnpm`:

   ```bash
   pnpm install
   ```

4. **Build the Project**: Build all packages to ensure everything is working:

   ```bash
   pnpm build
   ```

5. **Run Scripts**: Use the provided scripts for development:
   - `pnpm format`: Format the codebase.
   - `pnpm format:check`: Check for formatting issues.
   - `pnpm scripts:prepare`: Prepare packages for publishing.
   - `pnpm burnthemall`: Clean up `node_modules` across the project.

## Development Workflow

1. **Create a Branch**: Create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Implement your changes in the appropriate files. Ensure you follow the coding style and conventions used in the project.

3. **Run Tests**: If applicable, add and run tests to verify your changes.

4. **Commit Changes**: Commit your changes with a meaningful commit message:

   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

5. **Push Changes**: Push your branch to your forked repository:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**: Open a pull request (PR) to the `main` branch of the original repository. Provide a clear description of your changes and link any related issues.

## Code Style

- Use [Prettier](https://prettier.io/) for code formatting. Run `pnpm format` before committing.
- Follow the existing code structure and naming conventions.

## Reporting Issues

If you encounter a bug or have a feature request, please open an issue on GitHub. Provide as much detail as possible, including steps to reproduce the issue or a clear description of the feature.

## License

By contributing to ContentKit, you agree that your contributions will be licensed under the [BSD-3-Clause License](./LICENSE).

## Questions?

If you have any questions, feel free to reach out by opening an issue or contacting the maintainers.

Thank you for contributing to ContentKit!
