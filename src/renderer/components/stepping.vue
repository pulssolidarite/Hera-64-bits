<template>
    <div class="stepping" id="stepping">
        <div class="step">
            <span class="etape">Etape</span>
            <span class="numero-etape">{{n_step +1}}</span>
        </div>
        <div class="indicator">
            <div class="indicator-step"  v-for="i in nb_step" :key="i" :for="i">
              <div :class="[i <= n_step+1 ? 'star_fill' : 'star_empty']"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["n_step"],
    data: function() {
        return {
            nb_step: 5, 
        };
    }
}
</script>
