<script lang="ts">
    export let title: string;
</script>

<li class="p-matrix__item">
    <div class="p-matrix__content">
        <h3 class="p-matrix__title">{title}</h3>
        <div class="p-matrix__desc">
            <slot />
        </div>
    </div>
</li>
