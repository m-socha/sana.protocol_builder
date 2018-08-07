# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2018-02-21 18:13


from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_auto_20180119_1422'),
    ]

    operations = [
        migrations.CreateModel(
            name='AbstractElement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('display_index', models.PositiveIntegerField()),
                ('element_type', models.CharField(choices=[(b'DATE', b'DATE'), (b'ENTRY', b'ENTRY'), (b'SELECT', b'SELECT'), (b'MULTI_SELECT', b'MULTI_SELECT'), (b'RADIO', b'RADIO'), (b'PICTURE', b'PICTURE'), (b'PLUGIN', b'PLUGIN'), (b'ENTRY_PLUGIN', b'ENTRY_PLUGIN')], max_length=12)),
                ('choices', models.TextField(blank=True, null=True)),
                ('question', models.TextField(blank=True, null=True)),
                ('answer', models.TextField(blank=True, null=True)),
                ('required', models.BooleanField(default=False)),
                ('image', models.TextField(blank=True, null=True)),
                ('audio', models.TextField(blank=True, null=True)),
                ('action', models.TextField(blank=True, null=True)),
                ('mime_type', models.CharField(blank=True, max_length=128, null=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('concept', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='abstractelements', to='api.Concept')),
            ],
            options={
                'ordering': ['concept', 'display_index'],
            },
        ),
        migrations.AlterField(
            model_name='element',
            name='page',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='elements', to='api.Page'),
        ),
    ]
