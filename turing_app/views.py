from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect 
from django.urls import reverse
import math
import json

# Create your views here.

BASE_DIR = 'turing_app/'
MULTI_DIR = 'MultiTape/'

def index(request):
    return render(request, BASE_DIR + 'index.html')

def mt_addition(request):
    data = request.session.get('data', {})
    m = data['m']
    n = data['n']

    context = {
        'mn': m + n,
    }
    return render(request, BASE_DIR + MULTI_DIR + 'addition.html', context)

def mt_division(request):
    init_input = ""
    if request.method == 'POST':
        init_input = request.POST.get('final_output')
        ar = init_input.split(' ')
        init_input = ''.join(ar)

        data = request.session.get('data', {})
        add_sign = request.session.get('add_sign')
        a = data['a']
        even = False

        if len(a) % 2 == 0:
            even = True

        b = data['b'] + '1'
        if add_sign == '+':
            init_input = '+' + init_input
        elif add_sign == '-':
            if not even:
                init_input = '-' + init_input
            else:
                init_input = '+' + init_input


        init_input = init_input[:-1]
        init_input = init_input + b 


    context = {
        'init_input': init_input
    }
    print(init_input)
    return render(request, BASE_DIR + MULTI_DIR + 'division.html', context)

def mt_power(request):
    init_input = ""
    if request.method == 'POST':
        init_input = request.POST.get('final_output')
        ar = init_input.split(' ')
        init_input = ''.join(ar)

        data = request.session.get('data', {})
        request.session['add_sign'] = init_input[0]


        a = data['a'] + '1'
        print(f"a: {a}")

        init_input = init_input[1:]
        init_input = a + init_input


    context = {
        'init_input': init_input
    }
    print(init_input)

    return render(request, BASE_DIR + MULTI_DIR + 'power.html', context)

def X(request):
    if request.method == 'POST':
        m = request.POST.get('m')
        n = request.POST.get('n')
        a = request.POST.get('a')
        b = request.POST.get('b')

        data = {
            'm': m,
            'n': n,
            'a': a,
            'b': b,
        }

        request.session['data'] = data

        return HttpResponseRedirect(reverse('mt_addition'))
    return render(request, BASE_DIR + MULTI_DIR + 'X.html')