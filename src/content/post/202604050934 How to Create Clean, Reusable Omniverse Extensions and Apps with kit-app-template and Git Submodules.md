---
subject_tags:
  - Omniverse
  - kit-app-template
  - Git submodules
  - NVIDIA Kit
created: 2026-04-05T09:34:00
modified: 2026-04-05T10:01:22-07:00
published_date: 2026-04-05T12:00:00+02:00
note_type: post
publish: true
website_tags:
  - Omniverse
  - Developer Workflow
  - Git
title: How to Create Clean, Reusable Omniverse Extensions and Apps with kit-app-template and Git Submodules
description: Using git submodules, symlinks, and kit-app-template to keep Omniverse extensions and apps in independent repositories while preserving the template build workflow.
---

## Kit App Template

Nvidia's `kit-app-template`[^1] is the standard starting point for building custom Omniverse extensions and applications. However, the default workflow has a limitation that many developers run into quickly: after you run `./repo.sh template new`, your new extension or app gets scattered across the template repository, making it hard to keep your code in its own clean, independently versioned repository.

A good solution exists in a YouTube video by Mati Codes, but it assumes your extension or app already lives in a separate repo. This post documents Mati’s submodule + symlink approach and extends it to cover the common case where you start by generating the extension or app directly inside the kit-app-template.

## Mati’s Submodule Approach

Mati Codesal has one of the clearest explanations of working with git submodules in Omniverse: *Kit 104: Using Git Submodules When Creating an Omniverse App*.[^2]

In his video, Mati creates an `external/` folder at the root of the kit-app-template repo to hold git submodules for extensions (and potentially apps). He then places symlinks inside `source/extensions/` (or `source/apps/`) that point to the real code in `external/`. This keeps the build system happy while allowing for clean, reusable repositories.

The approach is solid, but it doesn’t cover the first step one typically encounters: extracting a newly generated extension or app out of the kit-app-template monorepo.

## The Typical Starting Point

When you create something new, this is what happens:[^3]

```bash
./repo.sh template new
```

You pick “Extension” or “Application” (e.g. Kit Base Editor template), give it a name like `emergent_ops.simple_kit_based_editor`, and the tool creates files in `source/apps/` or `source/extensions/`, modifies `premake5.lua`, `repo.toml`, and adds a `rendered_template_metadata.json`.

At this point your Git status shows a mix of new files and modifications spread across the template. This is fine for quick testing, but not ideal if you want the extension or app to live in its own repository.

After running `./repo.sh template new` and choosing a basic Python extension, here’s what Git sees:

```bash
user@workstation:~/kit-app-template$ git status
Untracked files:
  source/

user@workstation:~/kit-app-template$ ls source/extensions/emergent_ops.classic_boids/
config  data  docs  emergent_ops  premake5.lua
```

## The Pain Point Also Applies to Apps

The same thing happens when you create an app (e.g. using the Kit Base Editor template). You get:

```text
new file: source/apps/emergent_ops.simple_kit_based_editor.kit
modified: premake5.lua
modified: repo.toml
Untracked files:
  source/extensions/          # ← your other extensions still show up here
```

Your custom app’s `.kit` file ends up inside the template repo, and any extensions you create alongside it are mixed in too.

## Recommended Structure

Create an `external/` folder at the root of your kit-app-template repo to hold the actual git submodules. Then use symlinks under `source/` so the build system sees the code in the expected location.

Example layout:

```
kit-app-template/
├── external/
│   └── extensions/
│       └── emergent_ops.classic_boids/     ← git submodule
├── source/
│   ├── apps/
│   │   └── emergent_ops.simple_kit_based_editor/   ← your app (can also be a submodule)
│   └── extensions/
│       └── emergent_ops.classic_boids/     ← symlink → ../../external/extensions/emergent_ops.classic_boids
├── premake5.lua
└── repo.toml
```

## Step-by-Step Workflow

**1. Generate the extension or app inside the template**  
Run `./repo.sh template new` and create your extension or app as usual.

**2. Extract it into its own repository**

For an extension:
```bash
cd source/extensions/emergent_ops.classic_boids
git init
echo "premake5.lua" >> .gitignore     # exclude build artifact
git add .
git commit -m "Initial commit"
```

Push to a new GitHub (or other) repository, then do the same for your app if needed.

**3. Move the submodule into external/ and create the symlink**

```bash
# From the root of kit-app-template

mkdir -p external/extensions

# Add as submodule in external/
git submodule add https://github.com/yourname/emergent_ops.classic_boids.git \
  external/extensions/emergent_ops.classic_boids

# Remove any old folder and create symlink
rm -rf source/extensions/emergent_ops.classic_boids
ln -s ../../external/extensions/emergent_ops.classic_boids \
      source/extensions/emergent_ops.classic_boids

git add external/extensions/emergent_ops.classic_boids .gitmodules
git commit -m "Add extension via external submodule + symlink"
```

For an app, do the same under `external/apps/` and symlink into `source/apps/`.

**4. Development workflow**

Edit files directly inside the repository at `external/extensions/emergent_ops.classic_boids` (or the app equivalent). The symlink makes changes immediately visible when you run `./repo.sh launch`.

When you want to commit a stable version, commit and push from the `external/` location, then run `git submodule update --remote` as needed.

## Notes on premake5.lua

Do not commit `premake5.lua` to your extension or app repository. It is a build-system file tied to the kit-app-template.[^1] Add it to `.gitignore` in your standalone repo. The root `premake5.lua` and your app’s `.kit` file are usually sufficient for pure Python extensions and many apps.

---

## Footnotes

[^1]: NVIDIA-Omniverse *kit-app-template* (GitHub). <https://github.com/NVIDIA-Omniverse/kit-app-template>

[^2]: Matias Codesal, *Kit 104: Using Git Submodules When Creating an Omniverse App* (YouTube). <https://www.youtube.com/watch?v=lpEhjVMrfAA>

[^3]: Omniverse Kit SDK Companion Tutorial — *kit-app-template*. Describes the template workflow, repository layout, and what happens when you add extensions or applications (including how `repo.sh`, `premake5.lua`, and `repo.toml` fit together). <https://docs.omniverse.nvidia.com/kit/docs/kit-app-template/latest/docs/intro.html>
