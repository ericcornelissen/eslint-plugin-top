<!-- SPDX-License-Identifier: CC0-1.0 -->

# Release Guidelines

If you need to release a new version of `@ericcornelissen/eslint-plugin-top`,
follow the guidelines found in this document.

- [Automated Releases (Preferred)](#automated-releases-preferred)
- [Manual Releases (Discouraged)](#manual-releases-discouraged)

## Automated Releases (Preferred)

To release a new version follow these steps:

1. [Manually trigger] the [release workflow] from the `main` branch; Use an
   update type in accordance with [Semantic Versioning]. This will create a Pull
   Request that start the release process.
1. Follow the instructions in the Pull Request description.

## Manual Releases (Discouraged)

If it's not possible to use automated releases, or if something goes wrong with
the automatic release process, you can follow these steps to release a new
version (using `v2.4.1` as an example):

1. Make sure that your local copy of the repository is up-to-date, sync:

   ```shell
   git checkout main
   git pull origin main
   ```

   Or clone:

   ```shell
   git clone git@github.com:ericcornelissen/eslint-plugin-top.git
   ```

1. Update the version number in the package manifest and lockfile:

   ```shell
   npm version v2.4.1 --no-git-tag-version
   ```

   If that fails, change the value of the version field in `package.json` to the
   new version:

   ```diff
   -  "version": "2.4.0",
   +  "version": "2.4.1",
   ```

   and update the version number in `package-lock.json` using `npm install`
   (after updating `package.json`), which will sync the version number.

1. Update the changelog:

   ```shell
   node script/bump-changelog.js
   ```

   If that fails, manually add the following text after the `## [Unreleased]`
   line:

   ```markdown
   - _No changes yet_

   ## [2.4.1] - YYYY-MM-DD
   ```

   The date should follow the year-month-day format where single-digit months
   and days should be prefixed with a `0` (e.g. `2022-01-01`).

1. Commit the changes to a new release branch and push using:

   ```shell
   git checkout -b release-$(sha1sum package-lock.json | awk '{print $1}')
   git add CHANGELOG.md package.json package-lock.json
   git commit --message "version bump"
   git push origin release-$(sha1sum package-lock.json | awk '{print $1}')
   ```

1. Create a Pull Request to merge the release branch into `main`.

1. Merge the Pull Request if the changes look OK and all continuous integration
   checks are passing.

   > **Note**: At this point, the continuous delivery automation may pick up and
   > complete the release process. If not, or only partially, continue following
   > the remaining steps.

1. Immediately after the Pull Request is merged, sync the `main` branch:

   ```shell
   git checkout main
   git pull origin main
   ```

1. Create a [git tag] for the new version:

   ```shell
   git tag v2.4.1
   ```

1. Update the `v2` branch to point to the same commit as the new tag:

   ```shell
   git checkout v2
   git merge main
   ```

1. Push the `v2` branch and new tag:

   ```shell
   git push origin v2 v2.4.1
   ```

1. Publish to [npm]:

   ```shell
   npm clean-install
   npm publish
   ```

[git tag]: https://git-scm.com/book/en/v2/Git-Basics-Tagging
[manually trigger]: https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow
[npm]: https://www.npmjs.com/
[release workflow]: ./.github/workflows/release.yml
[semantic versioning]: https://semver.org/spec/v2.0.0.html
