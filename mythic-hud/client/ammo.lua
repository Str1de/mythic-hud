local _ammoShowing = false

-- Hide native GTA ammo/weapon HUD elements
CreateThread(function()
    while true do
        HideHudComponentThisFrame(2)  -- wanted stars (reticle area)
        HideHudComponentThisFrame(3)  -- weapon icon
        HideHudComponentThisFrame(4)  -- ammo count
        HideHudComponentThisFrame(20) -- weapon wheel
        Wait(0)
    end
end)

local WEAPON_LABELS = {
    [`WEAPON_PISTOL`] = 'Pistol',
    [`WEAPON_PISTOL_MK2`] = 'Pistol MK2',
    [`WEAPON_COMBATPISTOL`] = 'Combat Pistol',
    [`WEAPON_APPISTOL`] = 'AP Pistol',
    [`WEAPON_STUNGUN`] = 'Taser',
    [`WEAPON_PISTOL50`] = 'Pistol .50',
    [`WEAPON_SNSPISTOL`] = 'SNS Pistol',
    [`WEAPON_SNSPISTOL_MK2`] = 'SNS Pistol MK2',
    [`WEAPON_HEAVYPISTOL`] = 'Heavy Pistol',
    [`WEAPON_VINTAGEPISTOL`] = 'Vintage Pistol',
    [`WEAPON_FLAREGUN`] = 'Flare Gun',
    [`WEAPON_MARKSMANPISTOL`] = 'Marksman Pistol',
    [`WEAPON_REVOLVER`] = 'Revolver',
    [`WEAPON_REVOLVER_MK2`] = 'Revolver MK2',
    [`WEAPON_DOUBLEACTION`] = 'Double Action',
    [`WEAPON_CERAMICPISTOL`] = 'Ceramic Pistol',
    [`WEAPON_NAVYREVOLVER`] = 'Navy Revolver',
    [`WEAPON_GADGETPISTOL`] = 'Perico Pistol',
    [`WEAPON_MICROSMG`] = 'Micro SMG',
    [`WEAPON_SMG`] = 'SMG',
    [`WEAPON_SMG_MK2`] = 'SMG MK2',
    [`WEAPON_ASSAULTSMG`] = 'Assault SMG',
    [`WEAPON_COMBATPDW`] = 'Combat PDW',
    [`WEAPON_MACHINEPISTOL`] = 'Machine Pistol',
    [`WEAPON_MINISMG`] = 'Mini SMG',
    [`WEAPON_PUMPSHOTGUN`] = 'Pump Shotgun',
    [`WEAPON_PUMPSHOTGUN_MK2`] = 'Pump Shotgun MK2',
    [`WEAPON_SAWNOFFSHOTGUN`] = 'Sawed-Off',
    [`WEAPON_ASSAULTSHOTGUN`] = 'Assault Shotgun',
    [`WEAPON_BULLPUPSHOTGUN`] = 'Bullpup Shotgun',
    [`WEAPON_MUSKET`] = 'Musket',
    [`WEAPON_HEAVYSHOTGUN`] = 'Heavy Shotgun',
    [`WEAPON_DBSHOTGUN`] = 'Double Barrel',
    [`WEAPON_COMBATSHOTGUN`] = 'Combat Shotgun',
    [`WEAPON_ASSAULTRIFLE`] = 'Assault Rifle',
    [`WEAPON_ASSAULTRIFLE_MK2`] = 'Assault Rifle MK2',
    [`WEAPON_CARBINERIFLE`] = 'Carbine Rifle',
    [`WEAPON_CARBINERIFLE_MK2`] = 'Carbine Rifle MK2',
    [`WEAPON_ADVANCEDRIFLE`] = 'Advanced Rifle',
    [`WEAPON_SPECIALCARBINE`] = 'Special Carbine',
    [`WEAPON_SPECIALCARBINE_MK2`] = 'Special Carbine MK2',
    [`WEAPON_BULLPUPRIFLE`] = 'Bullpup Rifle',
    [`WEAPON_BULLPUPRIFLE_MK2`] = 'Bullpup Rifle MK2',
    [`WEAPON_COMPACTRIFLE`] = 'Compact Rifle',
    [`WEAPON_MILITARYRIFLE`] = 'Military Rifle',
    [`WEAPON_MG`] = 'MG',
    [`WEAPON_COMBATMG`] = 'Combat MG',
    [`WEAPON_COMBATMG_MK2`] = 'Combat MG MK2',
    [`WEAPON_GUSENBERG`] = 'Gusenberg',
    [`WEAPON_SNIPERRIFLE`] = 'Sniper Rifle',
    [`WEAPON_HEAVYSNIPER`] = 'Heavy Sniper',
    [`WEAPON_HEAVYSNIPER_MK2`] = 'Heavy Sniper MK2',
    [`WEAPON_MARKSMANRIFLE`] = 'Marksman Rifle',
    [`WEAPON_MARKSMANRIFLE_MK2`] = 'Marksman Rifle MK2',
    [`WEAPON_GRENADELAUNCHER`] = 'Grenade Launcher',
    [`WEAPON_RPG`] = 'RPG',
    [`WEAPON_MINIGUN`] = 'Minigun',
    [`WEAPON_FIREWORK`] = 'Firework Launcher',
    [`WEAPON_RAILGUN`] = 'Railgun',
    [`WEAPON_HOMINGLAUNCHER`] = 'Homing Launcher',
    [`WEAPON_COMPACTLAUNCHER`] = 'Compact Launcher',
}

-- Melee / throwable weapons that shouldn't show ammo
local NO_AMMO_GROUPS = {
    [GetHashKey('GROUP_MELEE')] = true,
    [GetHashKey('GROUP_UNARMED')] = true,
    [GetHashKey('GROUP_PETROLCAN')] = true,
    [GetHashKey('GROUP_FIREEXTINGUISHER')] = true,
    [GetHashKey('GROUP_THROWN')] = true,
    [GetHashKey('GROUP_PARACHUTE')] = true,
}

CreateThread(function()
    local _armedState = false
    while true do
        local ped = PlayerPedId()
        local _, currentWeapon = GetCurrentPedWeapon(ped, true)

        if currentWeapon and currentWeapon ~= GetHashKey('WEAPON_UNARMED') then
            local weaponGroup = GetWeapontypeGroup(currentWeapon)

            if not NO_AMMO_GROUPS[weaponGroup] then
                if not _armedState then
                    _armedState = true
                    if Hud then Hud:XHair(true) end
                end
                local _, maxAmmo = GetMaxAmmo(ped, currentWeapon)
                local currentAmmo = GetAmmoInPedWeapon(ped, currentWeapon)
                local clipSize = GetMaxAmmoInClip(ped, currentWeapon, true)
                local clipAmmo = 0

                if clipSize > 0 then
                    _, clipAmmo = GetAmmoInClip(ped, currentWeapon)
                else
                    clipAmmo = currentAmmo
                end

                local reserve = currentAmmo - clipAmmo
                local weaponLabel = WEAPON_LABELS[currentWeapon] or ''

                SendNUIMessage({
                    type = 'UPDATE_AMMO',
                    data = {
                        current = clipAmmo,
                        reserve = reserve,
                        weaponLabel = weaponLabel,
                    },
                })

                _ammoShowing = true
            else
                if _ammoShowing then
                    SendNUIMessage({ type = 'HIDE_AMMO', data = {} })
                    _ammoShowing = false
                end
                if _armedState then
                    _armedState = false
                    if Hud then Hud:XHair(false) end
                end
            end
        else
            if _ammoShowing then
                SendNUIMessage({ type = 'HIDE_AMMO', data = {} })
                _ammoShowing = false
            end
            if _armedState then
                _armedState = false
                if Hud then Hud:XHair(false) end
            end
        end

        Wait(100)
    end
end)
