#!/bin/bash
# Mac executable to sync scripts to Adobe installation paths.

END=[0m
BOLD=[1m
UNDERLINE=[4m
RED=[91m
GREEN=[92m
YELLOW=[93m

error() { local message=$1; echo; echo "$RED$message$END"; echo; exit 1; }

# Find adobe apps and determine its scripts directory parent.
# In mac, localized directories always have `.localized` suffix.
patch_app() {
    local name=$1
    local action_extension=$2
    local scripts_filename="$name Scripts"
    local action_filename="Prepress Adobe Scripts.$action_extension"
    local success=false

    echo
    echo "Patching $name..."

    for app in "/Applications/"*; do
        local app_name=`basename "$app"`
        if [[ $app_name == *Adobe* ]] && [[ $app_name == *$name* ]]; then
            local presets="$app/Presets"
            local localizedPresets="$presets.localized"
            if [[ -d "$localizedPresets" ]]; then
                for preset in "$localizedPresets/"*; do
                    success=true
                    patch_preset "$app" "$scripts_filename" "$action_filename" "$preset"
                done
            else
                success=true
                patch_preset "$app" "$scripts_filename" "$action_filename" "$presets"
            fi
        fi
    done
    if [[ $success = false ]]; then
        echo "${RED}Not found.$END"
    fi
}

# Wipe out current scripts and shared libraries, then copy new ones.
patch_preset() {
    local full_name=$1
    local scripts_filename=$2
    local action_filename=$3
    local target_root=$4

    echo "- $GREEN$full_name$END"

    # Delete existing
    if [[ -d "$target_root/.stdlib" ]]; then
        rm -rf "$target_root/.stdlib"
        mkdir "$target_root/.stdlib"
    fi
    if [[ -d "$target_root/.stdres" ]]; then
        rm -rf "$target_root/.stdres"
        mkdir "$target_root/.stdres"
    fi
    if [[ -d "$target_root/Scripts" ]]; then
        rm -rf "$target_root/Scripts"
        mkdir "$target_root/Scripts"
    fi
    if [[ -f "$target_root/Actions/$action_filename" ]]; then
        rm -f "$target_root/Actions/$action_filename"
    fi
    # Copy new ones
    cp -r "$source_root/.stdlib"/. "$target_root/.stdlib"
    cp -r "$source_root/.stdres"/. "$target_root/.stdres" && chmod +x "$target_root/.stdres/script/check_updates.command"
    cp -r "$source_root/$scripts_filename"/. "$target_root/Scripts"
    cp "$source_root/Actions/$action_filename" "$target_root/Actions/$action_filename"
    # Clean up
    rm -f "$target_root/.stdres/script/check_updates.cmd"
    rm -rf "$target_root/Scripts/.incubating"
}

# source_root doesn't end with slash
source_root="$(cd `dirname "$0"` && pwd)"

# Check OS
if [[ `uname` != Darwin ]]; then error "Unsupported OS."; fi

# Check sources
if [[ ! -d "$source_root/.stdlib" ]] || [[ ! -d "$source_root/.stdres" ]]; then error "Missing hidden directories."; fi
if [[ ! -d "$source_root/Illustrator Scripts" ]] || [[ ! -d "$source_root/Photoshop Scripts" ]]; then error "Missing scripts."; fi
if [[ ! -d "$source_root/Actions" ]]; then error "Missing actions."; fi

# Check permissions
if [[ "$EUID" -ne 0 ]]; then error "Root access required."; fi

echo
echo "$YELLOW${BOLD}WARNING$END"
echo "${YELLOW}This command will replace all existing scripts, even the default ones."
echo "Backup if necessary.$END"
echo
echo "$BOLD${UNDERLINE}Prepress Adobe Scripts$END"
echo
echo "1. Illustrator"
echo "2. Photoshop"
echo "A. All"
echo
echo "Q. Quit"
echo
echo "${BOLD}Which scripts would you like to install:$END"
read input

case "$input" in
    1)
        patch_app "Illustrator" "aia"
        ;;
    2)
        patch_app "Photoshop" "atn"
        ;;
    a | A)
        patch_app "Illustrator" "aia"
        patch_app "Photoshop" "atn"
        ;;
    q | Q)
        ;;
    *)
        error "Unable to recognize input."
        ;;
esac

echo
echo "Goodbye!"
echo
exit 0