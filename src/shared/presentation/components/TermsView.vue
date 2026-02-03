<script setup>
import { RouterLink } from 'vue-router';
import { AppRouteName } from '@/app/routing/AppRouteName';
</script>

<template>
    <article id="terms"
        class="max-w-[1400px] py-10 m-1 mt-5 md:m-5 xl:mx-auto text-justify bg-[var(--color-electric)] rounded-lg p-1 md:p-5"
        aria-labelledby="terms-title">

        <header class="mb-6">
            <h1 id="terms-title" class="text-3xl font-bold">
                Terms of Service
            </h1>
            <p class="text-sm opacity-80">
                <em>Last updated: 2026-02-02</em>
            </p>
        </header>

        <section class="space-y-4 border p-5 rounded-lg bg-[var(--bg-custom)]">

            <h2 class="text-2xl font-bold mt-4">
                Project Overview
            </h2>

            <p>
                <strong>PokéGen</strong> is a
                <em>fan-made application</em> created for
                <strong>educational and recreational purposes</strong>.
            </p>

            <p>
                It is <strong>not affiliated with, endorsed by, or associated with</strong>
                Nintendo, Game Freak, or The Pokémon Company.
            </p>

            <h2 class="text-2xl font-bold mt-4">
                Intellectual Property
            </h2>

            <p>
                All Pokémon-related content, including
                <strong>names, images, and data</strong>,
                is the property of their respective owners.
            </p>

            <p>
                PokéGen sources its information from
                <strong>PokéAPI</strong>, a third-party service.
            </p>

            <p>
                <strong>PokéGen does not claim ownership</strong>
                over any Pokémon intellectual property.
            </p>

            <h2 class="text-2xl font-bold mt-4">
                Permitted Use
            </h2>

            <p>
                The website may be used
                <strong>only for personal, informational, and non-commercial purposes</strong>.
            </p>

            <p>
                Any <strong>unauthorized commercial use</strong>,
                redistribution, or reproduction of the content
                is prohibited.
            </p>

            <h2 class="text-2xl font-bold mt-4">
                Restrictions
            </h2>

            <p>
                Users are prohibited from using the site for
                <strong>unlawful, harmful, or malicious purposes</strong>.
            </p>

            <ul>
                <li>- harassment, hate speech, or discriminatory behavior</li>
                <li>- attempts to gain unauthorized access</li>
                <li>- interference with normal site operation</li>
            </ul>

            <h2 class="text-2xl font-bold mt-4">
                Disclaimer of Warranties
            </h2>

            <p>
                The site and its content are provided
                <strong>“as is”</strong>, without warranties of any kind.
            </p>

            <p>
                PokéGen does <em>not guarantee</em> the
                <strong>accuracy, completeness, or reliability</strong>
                of the information provided.
            </p>

            <h2 class="text-2xl font-bold mt-4">
                Limitation of Liability
            </h2>

            <p>
                Users acknowledge that they use the site
                <strong>at their own risk</strong>.
            </p>

            <ul>
                <li>- direct or indirect damages</li>
                <li>- errors or omissions in content</li>
                <li>- service interruptions or failures</li>
                <li>- third-party service issues</li>
            </ul>

            <h2 class="text-2xl font-bold mt-4">
                External Services
            </h2>

            <p>
                PokéGen may contain links to
                <strong>external websites or services</strong>
                not controlled by the author.
            </p>

            <p>
                The author assumes
                <em>no responsibility</em>
                for the content or practices of third-party services.
            </p>

            <h2 class="text-2xl font-bold mt-4">
                Changes to Terms
            </h2>

            <p>
                These Terms may be updated periodically.
                Users are encouraged to review them regularly.
            </p>

            <h2 class="text-2xl font-bold mt-4">
                Privacy Policy
            </h2>

            <p>
                Please refer to our
                <RouterLink class="text-blue-500 underline" :to="{ name: AppRouteName.Privacy }">
                    Privacy Policy
                </RouterLink>
                for details on data handling.
            </p>

            <h2 class="text-2xl font-bold mt-4">
                Governing Law
            </h2>

            <p>
                These Terms are governed by the
                <strong>laws of Italy</strong>.
            </p>

            <p>
                Any disputes shall fall under the
                <strong>exclusive jurisdiction of Italian courts</strong>.
            </p>

        </section>
    </article>
</template>
